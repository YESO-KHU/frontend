import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAgoraStatus } from '../../contexts/AgoraStatusContext';
import api from '../../api/api';

const AgoraStatusIndicator = () => {
    const [agoraStatus, setAgoraStatus] = useState(null);
    const [showIndicator, setShowIndicator] = useState(false); // 기본값을 false로 변경
    const { openStatusSlide } = useAgoraStatus();

    const getAgoraStatus = async () => {
        try {
            const res = await api.get('/api/agoras/my-waiting-room');
            setAgoraStatus(res.data);
            setShowIndicator(true);
        } catch (error) {
            console.error('아고라 상태 조회 실패:', error);
            if (error.response?.status === 403) {
                setShowIndicator(false);
            }
        }
    };

    useEffect(() => {
        getAgoraStatus();
        // 주기적으로 상태 업데이트 (30초마다)
        const interval = setInterval(getAgoraStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    // 상태에 따른 텍스트 변환
    const getStatusText = (currentPhase) => {
        switch (currentPhase) {
            case 'WAITING':
                return '아고라 대기중';
            case 'OPENING_STATEMENT_PRO':
            case 'OPENING_STATEMENT_CON':
            case 'DEBATE':
            case 'CLOSING_STATEMENT_PRO':
            case 'CLOSING_STATEMENT_CON':
                return '아고라 진행중';
            case 'ENDED':
                return '아고라 종료됨';
            default:
                return '아고라 대기중';
        }
    };

    // 상태에 따른 색상
    const getStatusColor = (currentPhase) => {
        switch (currentPhase) {
            case 'WAITING':
                return '#4DB985';
            case 'OPENING_STATEMENT_PRO':
            case 'OPENING_STATEMENT_CON':
            case 'DEBATE':
            case 'CLOSING_STATEMENT_PRO':
            case 'CLOSING_STATEMENT_CON':
                return '#F83001';
            case 'ENDED':
                return '#9E9E9E';
            default:
                return '#4DB985';
        }
    };

    // 403 에러 시 인디케이터 숨김
    if (!showIndicator) return null;

    return (
        <StatusIndicator onClick={openStatusSlide}>
            <StatusDot $color={agoraStatus ? getStatusColor(agoraStatus.currentPhase) : '#4DB985'} />
            <StatusText>
                {agoraStatus ? getStatusText(agoraStatus.currentPhase) : '아고라 대기중'}
            </StatusText>
        </StatusIndicator>
    );
};

export default AgoraStatusIndicator;

const StatusIndicator = styled.div`
    position: fixed;
    bottom: 100px; /* 푸터 위에 위치 */
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 20px;
    padding: 8px 16px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    z-index: 100;
    transition: all 0.2s ease;
    
    &:hover {
        transform: translateX(-50%) translateY(-2px);
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
        transform: translateX(-50%) translateY(0);
    }
`;

const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ $color }) => $color};
`;

const StatusText = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.gray};
`;
