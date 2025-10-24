import React from "react";
import styled from "styled-components";
import Header from "../../components/common/Header";
import sendIcon from '../../assets/icons/send.svg';
import megaphoneIcon from '../../assets/icons/megaphone.svg';
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgoraChatStartModal from "../../components/agora/modals/AgoraChatStartModal";
import AgoraChatSpeechModal from "../../components/agora/modals/AgoraChatSpeechModal";
import AgoraChatEndModal from "../../components/agora/modals/AgoraChatEndModal";
import { AgoraStatusContext } from "../../contexts/AgoraStatusContext";
import api from '../../api/api';

const AgoraChatPage = () => {
    const { agoraId } = useParams();
    const navigate = useNavigate();
    const context = useContext(AgoraStatusContext);

    if (!context) {
        throw new Error('AgoraChatPage must be used within an AgoraStatusProvider');
    }

    const {
        isConnected,
        messages,
        sendChatMessage,
        currentUserId,
        connectWebSocket,
        disconnectWebSocket
    } = context;

    /*
        - "start"	AgoraChatStartModal 열림
        - "speech"	입장발언모달 열림
        - "end"	토론 종료 모달 열림
        - null	아무 모달도 열리지 않음
    */
    const [activeModal, setActiveModal] = useState("start");
    const [inputMessage, setInputMessage] = useState('');
    const chatAreaRef = useRef(null);
    const [agoraDetail, setAgoraDetail] = useState(null);
    const [speechSummary, setSpeechSummary] = useState(null);
    const [submittedSpeeches, setSubmittedSpeeches] = useState(0);
    const [summaryFetched, setSummaryFetched] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [isDebateStarted, setIsDebateStarted] = useState(false);
    const [hideSubmissionMessages, setHideSubmissionMessages] = useState(false);
    const [isFreeDebate, setIsFreeDebate] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [debateTimer, setDebateTimer] = useState(60); // 본토론 1분 = 60초
    const [freeDebateTimer, setFreeDebateTimer] = useState(60); // 자유토론 1분 = 60초
    const [closingTimer, setClosingTimer] = useState(30); // 클로징 30초
    const [reportData, setReportData] = useState(null);
    const [participants, setParticipants] = useState([]);

    // 페이지 로드 시 WebSocket 연결 시도
    useEffect(() => {
        if (agoraId && !isConnected) {
            const userId = localStorage.getItem('userId');
            if (userId) {
                connectWebSocket(agoraId, userId, false); // 참가자로 연결
            }
        }
    }, [agoraId, isConnected, connectWebSocket]);

    // 채팅 영역 자동 스크롤
    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages]);

    // 메시지 전송
    const handleSendMessage = () => {
        if (inputMessage.trim() && isConnected) {
            sendChatMessage(inputMessage);
            setInputMessage('');
        }
    };

    // 엔터키로 메시지 전송
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };


    // 나가기 핸들러
    const handleBackClick = () => {
        if (isConnected) {
            disconnectWebSocket();
        }
        navigate(-1);
    };

    // 참여자 진영 찾기 함수
    const getParticipantSide = (userId) => {
        const participant = participants.find(p => p.userId === parseInt(userId));
        return participant?.side || null;
    };



    const getAgoraStatus = useCallback(async () => {
        try {
            const res = await api.get(`/api/agoras/${agoraId}`);
            console.log('아고라 상세 정보:', res.data);
            setAgoraDetail(res.data);
            // 참여자 목록 저장
            if (res.data.response?.participants) {
                setParticipants(res.data.response.participants);
            }
        } catch (error) {
            console.error('아고라 상세 정보 조회 실패:', error);
        }
    }, [agoraId]);

    useEffect(() => {
        if (agoraId) {
            getAgoraStatus();
        }
    }, [agoraId, getAgoraStatus]);

    // 입장발언 요약 조회
    const fetchSpeechSummary = useCallback(async () => {
        try {
            const res = await api.get(`/api/agoras/${agoraId}/speeches/summary`);
            console.log('입장발언 요약:', res.data);
            setSpeechSummary(res.data.response);
            setShowSummary(true);
            setTypedText(''); // 타이핑 시작
        } catch (error) {
            console.error('입장발언 요약 조회 실패:', error);
        }
    }, [agoraId]);

    // 토론 리포트 조회
    const fetchReport = useCallback(async () => {
        try {
            const res = await api.post(`/api/agoras/${agoraId}/report`);
            console.log('토론 리포트:', res.data);
            setReportData(res.data.response);
        } catch (error) {
            console.error('토론 리포트 조회 실패:', error);
        }
    }, [agoraId]);

    // 토론 시작 API 요청 제거 - 바로 공지 표시

    // 타이핑 애니메이션
    useEffect(() => {
        if (showSummary && speechSummary?.summary) {
            const fullText = speechSummary.summary;
            let currentIndex = 0;

            const typingInterval = setInterval(() => {
                if (currentIndex < fullText.length) {
                    setTypedText(fullText.substring(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    // 타이핑 완료 후 5초 뒤에 사라지게
                    setTimeout(() => {
                        setShowSummary(false);
                        setTypedText('');
                        setSpeechSummary(null);
                        setHideSubmissionMessages(true); // 제출 메시지 숨기기
                        // 바로 공지 표시
                        setIsDebateStarted(true);
                    }, 5000);
                }
            }, 50); // 50ms마다 한 글자씩

            return () => clearInterval(typingInterval);
        }
    }, [showSummary, speechSummary]);

    // 입장발언 제출 수 추적 및 요약 API 호출
    useEffect(() => {
        if (agoraDetail?.response && submittedSpeeches > 0 && !summaryFetched) {
            const totalParticipants = agoraDetail.response.prosCount + agoraDetail.response.consCount;
            console.log('입장발언 제출 수:', submittedSpeeches, '총 참가자 수:', totalParticipants);
            if (submittedSpeeches >= totalParticipants) {
                console.log('모든 참가자 제출 완료, 요약 API 호출');
                fetchSpeechSummary();
                setSummaryFetched(true); // 요약을 한 번만 가져오도록 플래그 설정
            }
        }
    }, [submittedSpeeches, agoraDetail, fetchSpeechSummary, summaryFetched]);

    // 입장발언 제출 수 증가
    useEffect(() => {
        const speechMessages = messages.filter(msg =>
            msg.type === 'SYSTEM_MESSAGE' &&
            msg.content.includes('입장 발언을 제출했습니다')
        );
        console.log('입장발언 제출 메시지들:', speechMessages);
        setSubmittedSpeeches(speechMessages.length);
    }, [messages]);

    // 본토론 3분 타이머
    useEffect(() => {
        if (isDebateStarted && !isFreeDebate) {
            const interval = setInterval(() => {
                setDebateTimer(prev => {
                    if (prev <= 1) {
                        // 3분 완료 시 자유토론으로 전환
                        setIsFreeDebate(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isDebateStarted, isFreeDebate]);

    // 자유토론 1분 타이머
    useEffect(() => {
        if (isFreeDebate && !isClosing) {
            const interval = setInterval(() => {
                setFreeDebateTimer(prev => {
                    if (prev <= 1) {
                        // 1분 완료 시 클로징으로 전환
                        setIsClosing(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isFreeDebate, isClosing]);

    // 클로징 30초 타이머
    useEffect(() => {
        if (isClosing) {
            const interval = setInterval(() => {
                setClosingTimer(prev => {
                    if (prev <= 1) {
                        // 30초 완료 시 리포트 조회 후 end 모달 표시
                        fetchReport().then(() => {
                            setActiveModal("end");
                        });
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isClosing, fetchReport]);

    return (
        <PageContainer>
            <Header content='agora' onClick={handleBackClick} />

            {/* 토론 시작 공지 */}
            {isDebateStarted && (
                <NoticeBox>
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                        <IconWrapper>
                            <img src={megaphoneIcon} alt="megaphone icon" />
                        </IconWrapper>
                        <NoticeTitle>
                            {isClosing ? '클로징 시간입니다.' :
                                isFreeDebate ? '자유토론 시간입니다.' :
                                    '다음은 본토론 시간입니다.'}
                        </NoticeTitle>
                    </div>
                    <NoticeDesc>
                        {isClosing ? (
                            <>
                                클로징 시간입니다. <br />
                                마지막 정리 발언을 해주세요.
                            </>
                        ) : isFreeDebate ? (
                            <>
                                자유토론 시간입니다. <br />
                                자유롭게 의견을 나누어보세요.
                            </>
                        ) : (
                            <>
                                본토론은 1분 동안 진행됩니다. <br />
                                입장 발언에 대한 반박 위주로 진행해주세요.
                            </>
                        )}
                    </NoticeDesc>
                    <TimeInfo>
                        남은 시간: {isClosing
                            ? `${Math.floor(closingTimer / 60)}:${(closingTimer % 60).toString().padStart(2, '0')}`
                            : isFreeDebate
                                ? `${Math.floor(freeDebateTimer / 60)}:${(freeDebateTimer % 60).toString().padStart(2, '0')}`
                                : `${Math.floor(debateTimer / 60)}:${(debateTimer % 60).toString().padStart(2, '0')}`
                        }
                    </TimeInfo>
                </NoticeBox>
            )}

            <ChatArea ref={chatAreaRef}>
                {messages.length === 0 && (
                    <EmptyMessage>
                        아직 메시지가 없습니다. 첫 번째 메시지를 보내보세요!
                    </EmptyMessage>
                )}

                {/* 입장발언 제출 알림들 - 바로바로 표시하되 AI 요약 사라질 때 함께 사라짐 */}
                {!hideSubmissionMessages && messages.filter(msg =>
                    msg.type === 'SYSTEM_MESSAGE' &&
                    msg.content.includes('입장 발언을 제출했습니다')
                ).map((message) => {
                    return (
                        <SystemMessage key={message.id}>
                            <SystemMessageText>
                                {message.content.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index < message.content.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </SystemMessageText>
                        </SystemMessage>
                    );
                })}

                {/* 입장발언 요약 표시 - 타이핑 애니메이션 */}
                {showSummary && (
                    <SummaryCard>
                        <SummaryTitle>AI가 요약한 입장 발언 정리 내용입니다.</SummaryTitle>
                        <SummaryContent>
                            {typedText}
                            <TypingCursor>|</TypingCursor>
                        </SummaryContent>
                    </SummaryCard>
                )}

                {/* 일반 메시지들 (입장발언 제출 알림 제외) */}
                {messages.filter(msg =>
                    !(msg.type === 'SYSTEM_MESSAGE' && msg.content.includes('입장 발언을 제출했습니다'))
                ).map((message) => {
                    // 내 메시지인지 확인 (sender가 현재 사용자 ID와 같은 경우)
                    const isMyMessage = message.sender === currentUserId?.toString();
                    const isSystemMessage = message.type === 'SYSTEM_MESSAGE';
                    // 시간 변환: UTC 시간에 9시간 추가하여 한국 시간으로 변환
                    let time;
                    try {
                        const originalDate = new Date(message.time);
                        if (isNaN(originalDate.getTime())) {
                            console.error('Invalid date:', message.time);
                            time = new Date().toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        } else {
                            const koreanTime = new Date(originalDate.getTime() + 9 * 60 * 60 * 1000);
                            time = koreanTime.toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        }
                    } catch (error) {
                        console.error('Time formatting error:', error);
                    }

                    if (isSystemMessage) {
                        return (
                            <SystemMessage key={message.id}>
                                <SystemMessageText>
                                    {message.content.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            {index < message.content.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </SystemMessageText>
                            </SystemMessage>
                        );
                    }

                    return (
                        <MessageContainer key={message.id} $isMyMessage={isMyMessage}>
                            {!isMyMessage && (
                                <Avatar>
                                    <AvatarCircle />
                                </Avatar>
                            )}
                            <MessageContent $isMyMessage={isMyMessage}>
                                {!isMyMessage && (
                                    <SenderName>
                                        {message.senderName || '익명의 사용자'}
                                        {agoraDetail?.response?.debateType === 'PROS_CONS' && (
                                            <SideTag $side={getParticipantSide(message.sender)}>
                                                {getParticipantSide(message.sender) === 'PROS' ? '찬' :
                                                    getParticipantSide(message.sender) === 'CONS' ? '반' : ''}
                                            </SideTag>
                                        )}
                                    </SenderName>
                                )}
                                <MessageBubble $isMyMessage={isMyMessage}>
                                    <MessageText $isMyMessage={isMyMessage}>{message.content}</MessageText>
                                </MessageBubble>
                                <MessageTime $isMyMessage={isMyMessage}>{time}</MessageTime>
                            </MessageContent>
                        </MessageContainer>
                    );
                })}
            </ChatArea>
            <Footer>
                <InputWrapper>
                    <Input
                        placeholder="의견을 전달해보세요"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!isConnected}
                    />
                    <FooterButton
                        variant="primary"
                        onClick={handleSendMessage}
                        disabled={!isConnected}
                    >
                        <img src={sendIcon} alt="send icon" />
                    </FooterButton>
                </InputWrapper>
            </Footer>

            {activeModal === "start" && (
                <AgoraChatStartModal
                    isOpen
                    onClose={() => setActiveModal("speech")}
                    agoraDetail={agoraDetail}
                />
            )}
            {activeModal === "speech" && (
                <AgoraChatSpeechModal
                    isOpen
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === "end" && (
                <AgoraChatEndModal
                    isOpen
                    onClose={handleBackClick}
                    reportData={reportData}
                />
            )}
        </PageContainer>
    );
};

export default AgoraChatPage;

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 0 16px 70px 16px;
    overflow: hidden; /* 외부 스크롤 방지 */
`;

const NoticeBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  padding: 12px;
  min-height: 78px;
  background: #FFF;
  border-radius: 10px;
  font-size: 13px;
  color:  ${({ theme }) => theme.gray};
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* 고정 영역 */
`;

const IconWrapper = styled.div`
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const NoticeTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.02em;
`;

const NoticeDesc = styled.div`
    font-size: 12px;
    font-weight: 300;
    line-height: 120%;
    letter-spacing: 0.02em;

    strong {
        font-weight: 700;
    }
`;

const ChatArea = styled.div`
  flex: 1;
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;


const EmptyMessage = styled.div`
    text-align: center;
    color: #999;
    font-size: 14px;
    padding: 20px;
`;

// 입장발언 요약 카드
const SummaryCard = styled.div`
    margin: 0 auto;
    width: 90%;
    background: white;
    border-radius: 10px;
    padding: 16px;
    margin-top: 20px;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.10);
`;

const SummaryTitle = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    line-height: 1.4;
`;

const SummaryContent = styled.div`
    font-size: 13px;
    font-weight: 400;
    color: #666;
    line-height: 1.5;
    white-space: pre-line;
`;

// 타이핑 커서 애니메이션
const TypingCursor = styled.span`
    animation: blink 1s infinite;
    color: #4DB985;
    font-weight: bold;
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;

// 메시지 컨테이너 (아바타와 메시지 그룹)
const MessageContainer = styled.div`
    display: flex;
    margin: 12px 0;
    align-items: flex-end;
    flex-direction: ${props => props.$isMyMessage ? 'row-reverse' : 'row'};
    gap: 8px;
`;

// 아바타 컨테이너
const Avatar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 18px;
`;

// 아바타 원형
const AvatarCircle = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #D9D9D9;
`;

// 메시지 콘텐츠 컨테이너
const MessageContent = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 70%;
    align-items: ${props => props.$isMyMessage ? 'flex-end' : 'flex-start'};
`;

// 발신자 이름
const SenderName = styled.div`
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
`;

// 진영 태그
const SideTag = styled.span`
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 8px;
    background: ${props => props.$side === 'PROS' ? '#E8F5E8' : '#FFE8E8'};
    color: ${props => props.$side === 'PROS' ? '#4CAF50' : '#F44336'};
    border: 1px solid ${props => props.$side === 'PROS' ? '#4CAF50' : '#F44336'};
`;

// 메시지 버블
const MessageBubble = styled.div`
    background: ${props => props.$isMyMessage ? '#8484FF' : 'white'};
    border-radius: ${props => props.$isMyMessage ? '8px 0px 8px 8px' : '0px 8px 8px 8px'};
    padding: 8px 12px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
    max-width: 100%;
    word-wrap: break-word;
`;

const MessageText = styled.div`
    color: ${props => props.$isMyMessage ? '#FFFFFF' : '#333333'};
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
    font-weight: 400;
`;

const MessageTime = styled.div`
    font-size: 11px;
    color: #888;
    margin-top: 4px;
    text-align: ${props => props.$isMyMessage ? 'right' : 'left'};
    font-weight: 300;
`;

// 시스템 메시지 스타일
const SystemMessage = styled.div`
    display: flex;
    justify-content: center;
    margin: 12px 0;
`;

const SystemMessageText = styled.div`
    background: rgba(0, 0, 0, 0.1);
    color: #666;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 12px;
    text-align: center;
    max-width: 80%;
    word-wrap: break-word;
`;

const Footer = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;   /* 화면 기준으로 중앙 정렬 */ 
    transform: translateX(-50%);  /* 중앙 보정 */
    max-width: 500px;
    width: 100%;
    height: 70px;
    background: #fff;
    z-index: 10; /* 겹칠 때 위로 올릴 순서 번호. 숫자가 높을수록 위로 올라감*/
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const TimeInfo = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: right;
  width: 100%;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.mainLight};  
`;

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(203, 203, 255, 0.1);
    width: 100%;
    padding: 12px 8px;
`;

const Input = styled.input`
  flex: 1;
  background: #FFF;
  border: 0.4px solid ${({ theme }) => theme.mainLight};
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  padding: 8px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FooterButton = styled.button`
  border: none;
  border-radius: 6px;
  width: 35px;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

    ${({ variant, theme }) => {
        switch (variant) {
            case "primary":
                return `
                background: ${theme.mainLight};
                color: #fff;
                `;
            case "secondary":
                return `
                background: #FFF;
                color: ${theme.mainLight};
                `;
        }
    }}
`;