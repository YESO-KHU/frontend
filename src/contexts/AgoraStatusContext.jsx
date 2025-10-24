import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import api from '../api/api';

const AgoraStatusContext = createContext();

export const useAgoraStatus = () => {
    const context = useContext(AgoraStatusContext);
    if (!context) {
        throw new Error('useAgoraStatus must be used within an AgoraStatusProvider');
    }
    return context;
};

export const AgoraStatusProvider = ({ children }) => {
    const [isStatusSlideOpen, setIsStatusSlideOpen] = useState(false);

    // WebSocket 관련 상태
    const [isConnected, setIsConnected] = useState(false);
    const [currentAgoraId, setCurrentAgoraId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isHost, setIsHost] = useState(false);

    // 실시간 데이터 상태
    const [messages, setMessages] = useState([]);
    const [speeches, setSpeeches] = useState([]);
    const [timer, setTimer] = useState(null);
    const [summary, setSummary] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [speechQueue, setSpeechQueue] = useState([]);

    const stompClientRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);

    const openStatusSlide = () => {
        setIsStatusSlideOpen(true);
    };

    const closeStatusSlide = () => {
        setIsStatusSlideOpen(false);
    };

    // WebSocket 연결
    const connectWebSocket = (agoraId, userId, isHostUser = false) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            disconnectWebSocket();
        }

        const socket = new SockJS('http://13.209.157.48:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            setIsConnected(true);
            setCurrentAgoraId(agoraId);
            setCurrentUserId(userId);
            setIsHost(isHostUser);
            stompClientRef.current = stompClient;

            // 토론방 입장
            stompClient.send(`/app/agora/${agoraId}/join`, {}, userId.toString());

            // 모든 토픽 구독
            subscribeToTopics(stompClient, agoraId);

            // 하트비트 설정 (30초마다)
            startHeartbeat(agoraId, userId);

        }, (error) => {
            console.error('WebSocket 연결 실패:', error);
            setIsConnected(false);
        });
    };

    // 토픽 구독
    const subscribeToTopics = (stompClient, agoraId) => {
        // 채팅 메시지 구독
        stompClient.subscribe(`/topic/agora/${agoraId}/chat`, (message) => {
            const data = JSON.parse(message.body);
            // 새로운 API 응답 형식 처리
            if (data.eventType === 'CHAT_MESSAGE' && data.data) {
                setMessages(prev => {
                    // 중복 메시지 방지 (같은 ID가 있으면 추가하지 않음)
                    const exists = prev.some(msg => msg.id === data.data.id);
                    if (exists) {
                        return prev;
                    }

                    return [...prev, {
                        id: data.data.id,
                        sender: data.data.sender.id.toString(),
                        senderName: data.data.sender.username,
                        content: data.data.content,
                        time: data.data.createdAt,
                        type: data.eventType
                    }];
                });
            } else if (data.eventType === 'SYSTEM_MESSAGE') {
                // 시스템 메시지 처리
                setMessages(prev => [...prev, {
                    id: `system_${Date.now()}`,
                    sender: 'system',
                    senderName: '시스템',
                    content: data.message || data.content,
                    time: data.timestamp || new Date().toISOString(),
                    type: 'SYSTEM_MESSAGE'
                }]);
            }
        });

        // 입장 발언 구독
        stompClient.subscribe(`/topic/agora/${agoraId}/speech`, (message) => {
            const data = JSON.parse(message.body);
            console.log('입장 발언 데이터:', data);
            if (data.eventType === 'SPEECH_SUBMITTED') {
                setSpeeches(prev => [...prev, data]);

                // 입장 발언 제출 알림 (모든 사용자에게 표시)
                setMessages(prev => {
                    // 이미 같은 speechId에 대한 알림이 있는지 확인 (speakerId가 아닌 speechId로 확인)
                    const existingMessage = prev.find(msg =>
                        msg.type === 'SYSTEM_MESSAGE' &&
                        msg.id && msg.id.includes(`speech_submitted_${data.speechId}`)
                    );

                    if (existingMessage) {
                        return prev; // 이미 있으면 추가하지 않음
                    }
                    return [...prev, {
                        id: `speech_submitted_${data.speechId}_${Date.now()}`,
                        sender: 'system',
                        senderName: '시스템',
                        content: `${data.speakerNickname || '참가자'}님이 입장 발언을 제출했습니다.`,
                        time: data.timestamp || new Date().toISOString(),
                        type: 'SYSTEM_MESSAGE'
                    }];
                });
            }
        });

        // 타이머 구독
        stompClient.subscribe(`/topic/agora/${agoraId}/timer`, (message) => {
            const data = JSON.parse(message.body);
            setTimer(data);
        });

        // AI 요약 구독
        stompClient.subscribe(`/topic/agora/${agoraId}/summary`, (message) => {
            const data = JSON.parse(message.body);
            console.log('AI 요약 데이터:', data);

            if (data.eventType === 'SUMMARY_STARTED') {
                // 요약 시작 알림
                setMessages(prev => [...prev, {
                    id: `summary_started_${Date.now()}`,
                    sender: 'system',
                    senderName: '시스템',
                    content: 'AI가 입장 발언을 요약하고 있습니다...',
                    time: data.timestamp || new Date().toISOString(),
                    type: 'SYSTEM_MESSAGE'
                }]);
            } else if (data.eventType === 'SUMMARY_IN_PROGRESS') {
                // 요약 진행 중 알림 (진행률 표시)
                const progress = Math.round((data.progress || 0) * 100);
                setMessages(prev => [...prev, {
                    id: `summary_progress_${Date.now()}`,
                    sender: 'system',
                    senderName: '시스템',
                    content: `AI 요약 진행 중... (${progress}%)`,
                    time: data.timestamp || new Date().toISOString(),
                    type: 'SYSTEM_MESSAGE'
                }]);
            } else if (data.eventType === 'SUMMARY_COMPLETED') {
                // 요약 완료 - 요약 내용을 시스템 메시지로 표시
                setSummary(data.summary);
                setMessages(prev => [...prev, {
                    id: `summary_completed_${Date.now()}`,
                    sender: 'system',
                    senderName: '시스템',
                    content: `AI 요약이 완료되었습니다.\n\n${data.summary}`,
                    time: data.timestamp || new Date().toISOString(),
                    type: 'SYSTEM_MESSAGE'
                }]);
            } else if (data.eventType === 'SUMMARY_FAILED') {
                // 요약 실패 알림
                setMessages(prev => [...prev, {
                    id: `summary_failed_${Date.now()}`,
                    sender: 'system',
                    senderName: '시스템',
                    content: 'AI 요약 생성에 실패했습니다.',
                    time: data.timestamp || new Date().toISOString(),
                    type: 'SYSTEM_MESSAGE'
                }]);
            }
        });

        // 본토론 발언 구독
        stompClient.subscribe(`/topic/agora/${agoraId}/debate`, () => {
        });

        // 클로징 발언 구독
        stompClient.subscribe(`/topic/agora/${agoraId}/closing/speech`, () => {
        });

        // 발언 대기열 구독
        stompClient.subscribe(`/queue/agora/${agoraId}/queue/response`, (message) => {
            const data = JSON.parse(message.body);
            console.log('발언 대기열 데이터:', data);

            if (data.eventType === 'QUEUE_REQUEST') {
                // 발언 대기열 데이터 처리
                setSpeechQueue(data.data);
            } else if (data.eventType === 'ERROR_OCCURRED') {
                console.error('대기열 조회 실패:', data.message);
            }
        });

        // 대기실 토론 시작 알림 구독
        stompClient.subscribe(`/topic/agora/${agoraId}/waiting-room`, (message) => {
            const data = JSON.parse(message.body);

            if (data.type === 'DEBATE_STARTED') {
                // 토론방으로 이동
                setTimeout(() => {
                    window.location.href = `/agora/chat/${data.data.agoraId}`;
                }, 1000);
            }
        });
    };

    // 하트비트 시작
    const startHeartbeat = (agoraId, userId) => {
        heartbeatIntervalRef.current = setInterval(() => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.send(`/app/agora/${agoraId}/heartbeat`, {}, userId.toString());
            }
        }, 30000);
    };

    // 하트비트 중지
    const stopHeartbeat = () => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
    };

    // WebSocket 연결 해제
    const disconnectWebSocket = useCallback(() => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            // 토론방 퇴장
            if (currentAgoraId && currentUserId) {
                stompClientRef.current.send(`/app/agora/${currentAgoraId}/leave`, {}, currentUserId.toString());
            }

            // 하트비트 중지
            stopHeartbeat();

            // 연결 해제
            stompClientRef.current.disconnect();
        }

        setIsConnected(false);
        setCurrentAgoraId(null);
        setCurrentUserId(null);
        setIsHost(false);
        setMessages([]);
        setSpeeches([]);
        setTimer(null);
        setSummary(null);
        setParticipants([]);
    }, [currentAgoraId, currentUserId]);

    // 채팅 메시지 전송 (REST API 사용)
    const sendChatMessage = async (content) => {
        if (content.trim() && currentAgoraId && currentUserId) {
            try {
                // REST API로 메시지 전송
                await api.post('/api/agoras/messages', {
                    agoraId: parseInt(currentAgoraId),
                    content: content
                }, {
                    params: {
                        user: {
                            id: parseInt(currentUserId),
                            username: `user${currentUserId}`,
                            password: '',
                            nickname: `사용자${currentUserId}`,
                            role: 'USER'
                        }
                    }
                });
            } catch (error) {
                console.error('채팅 메시지 전송 실패:', error);
                alert('메시지 전송에 실패했습니다.');
            }
        }
    };

    // 발언권 요청
    const requestSpeech = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(`/app/agora/${currentAgoraId}/request-speech`, {}, currentUserId.toString());
        }
    };

    // 발언권 취소
    const cancelSpeech = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(`/app/agora/${currentAgoraId}/cancel-speech`, {}, currentUserId.toString());
        }
    };

    // 발언 대기열 조회 요청
    const requestQueue = () => {
        if (stompClientRef.current && stompClientRef.current.connected && currentUserId) {
            stompClientRef.current.send(`/app/agora/${currentAgoraId}/queue/request`, {}, currentUserId.toString());
        }
    };

    // 타이머 동기화 요청
    const syncTimer = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(`/app/agora/${currentAgoraId}/timer/sync`, {}, '');
        }
    };

    // 페이지 이동 시에만 WebSocket 연결 해제
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                disconnectWebSocket();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [disconnectWebSocket]);

    const value = {
        // 기존 상태
        isStatusSlideOpen,
        openStatusSlide,
        closeStatusSlide,

        // WebSocket 상태
        isConnected,
        currentAgoraId,
        currentUserId,
        isHost,

        // 실시간 데이터
        messages,
        speeches,
        timer,
        summary,
        participants,
        speechQueue,

        // WebSocket 메서드
        connectWebSocket,
        disconnectWebSocket,
        sendChatMessage,
        requestSpeech,
        cancelSpeech,
        requestQueue,
        syncTimer,
        stompClientRef,
    };

    return (
        <AgoraStatusContext.Provider value={value}>
            {children}
        </AgoraStatusContext.Provider>
    );
};

// Context를 export하여 사용
export { AgoraStatusContext };
