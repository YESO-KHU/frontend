import styled from 'styled-components';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import clockIcon from '../../assets/icons/clock.svg';
import userProfileIcon from '../../assets/icons/userProfile.svg';
import { useAgoraStatus } from '../../contexts/AgoraStatusContext';
import { useNavigate } from 'react-router-dom';

const AgoraStatusModal = ({ isOpen, onClose }) => {
  const [agoraStatus, setAgoraStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { connectWebSocket } = useAgoraStatus();
  const navigate = useNavigate();


  const getAgoraStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/agoras/my-waiting-room');
      console.log(res.data);
      setAgoraStatus(res.data.response ?? null);
    } catch (error) {
      console.error('아고라 상태 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAgora = async () => {
    if (!agoraStatus?.agoraId) return;

    try {
      // 1. 토론 시작 API 호출
      const res = await api.post(`/api/agoras/${agoraStatus.agoraId}/start`, {
        agoraId: agoraStatus.agoraId,
        durationMinutes: 30,
        speechDurationMinutes: 3,
        allowSpectators: true,
        enableChat: true
      });
      console.log('토론 시작 성공:', res.data);

      // 2. 방장이 WebSocket에 연결하고 토론방에 입장
      const userId = localStorage.getItem('userId');
      if (userId) {
        console.log('방장이 WebSocket에 연결하고 토론방에 입장합니다.');
        connectWebSocket(agoraStatus.agoraId, userId, true); // 방장으로 연결

        // 3. 토론방 페이지로 이동
        setTimeout(() => {
          navigate(`/agora/chat/${agoraStatus.agoraId}`);
          onClose(); // 모달 닫기
        }, 1000);
      } else {
        console.error('userId가 없습니다.');
      }

      // 성공 시 상태 새로고침
      getAgoraStatus();
    } catch (error) {
      console.error('아고라 시작 실패:', error);
    }
  };


  // 열릴 때 데이터 로드
  useEffect(() => {
    if (isOpen) {
      getAgoraStatus();
    }
  }, [isOpen]);

  // ESC로 닫기 + 스크롤 락
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);


  const getStatusText = (currentPhase) => {
    switch (currentPhase) {
      case 'WAITING':
        return '대기중';
      case 'OPENING_STATEMENT_PRO':
      case 'OPENING_STATEMENT_CON':
      case 'DEBATE':
      case 'CLOSING_STATEMENT_PRO':
      case 'CLOSING_STATEMENT_CON':
        return '진행중';
      case 'ENDED':
        return '종료됨';
      default:
        return '알 수 없음';
    }
  };



  // 현재 사용자가 방장인지 확인 (API에서 제공하는 currentUserHost 사용)
  const isCurrentUserHost = () => {
    if (!agoraStatus) return false;
    return agoraStatus.currentUserHost;
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <ModalContainer role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>내 아고라 상태</ModalTitle>
          <CloseButton onClick={onClose} aria-label="닫기">×</CloseButton>
        </ModalHeader>

        <ModalContent>
          {loading ? (
            <LoadingContainer>
              <LoadingText>로딩 중...</LoadingText>
            </LoadingContainer>
          ) : agoraStatus ? (
            <StatusContent>
              <AgoraInfoCard>
                <AgoraHeader>
                  <AgoraTitle>{agoraStatus.title}</AgoraTitle>
                  <StatusBadge $status={agoraStatus.status}>
                    {getStatusText(agoraStatus.status)}
                  </StatusBadge>
                </AgoraHeader>

                <AgoraDescription>
                  {agoraStatus.description}
                </AgoraDescription>

                <AgoraDetails>
                  <DetailRow>
                    <IconWrapper>
                      <img src={userProfileIcon} alt="user icon" />
                    </IconWrapper>
                    <DetailText>
                      총 참여자: {agoraStatus.totalParticipants}명 (찬성: {agoraStatus.proCount}명, 반대: {agoraStatus.conCount}명)
                    </DetailText>
                  </DetailRow>

                  <DetailRow>
                    <IconWrapper>
                      <img src={userProfileIcon} alt="host icon" />
                    </IconWrapper>
                    <DetailText>
                      방장: {agoraStatus.hostUsername}
                    </DetailText>
                  </DetailRow>

                  {!agoraStatus.canStartDebate && (
                    <DetailRow>
                      <IconWrapper>
                        <img src={clockIcon} alt="warning icon" />
                      </IconWrapper>
                      <DetailText>
                        {agoraStatus.cannotStartReason}
                      </DetailText>
                    </DetailRow>
                  )}
                </AgoraDetails>

                <ParticipantInfo>
                  <ParticipantLabel>참여자 목록</ParticipantLabel>
                  {agoraStatus.participants.map((participant) => (
                    <ParticipantRow key={participant.participantId}>
                      <ParticipantCount>
                        {participant.username}
                        {participant.host && ' (방장)'}
                        {participant.side && ` (${participant.side})`}
                        {participant.ready && ' (준비완료)'}
                      </ParticipantCount>
                    </ParticipantRow>
                  ))}
                </ParticipantInfo>
              </AgoraInfoCard>

              <ActionButtons>
                {agoraStatus.status === 'WAITING' && (
                  <ActionButton
                    $variant="primary"
                    onClick={startAgora}
                    disabled={!agoraStatus.canStartDebate}
                  >
                    {isCurrentUserHost() ? '아고라 시작하기' : '아고라 입장하기'}
                  </ActionButton>
                )}
                {agoraStatus.status !== 'WAITING' && agoraStatus.status !== 'ENDED' && (
                  <ActionButton $variant="primary">토론 참여하기</ActionButton>
                )}
                <ActionButton $variant="secondary">상세 정보 보기</ActionButton>
              </ActionButtons>
            </StatusContent>
          ) : (
            <EmptyContainer>
              <EmptyText>참여 중인 아고라가 없습니다.</EmptyText>
              <EmptySubText>새로운 아고라에 참여해보세요!</EmptySubText>
            </EmptyContainer>
          )}
        </ModalContent>
      </ModalContainer>
    </>
  );
};

export default AgoraStatusModal;

/* ============== styles ============== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;

  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0px 10px 30px rgba(0,0,0,0.3);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.gray};
  margin: 0;
`;

const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f8f9fa;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const ModalContent = styled.div`
  padding: 24px;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex; align-items: center; justify-content: center;
  height: 200px;
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.gray};
  font-size: 16px;
`;

const StatusContent = styled.div`
  display: flex; flex-direction: column; gap: 20px;
`;

const AgoraInfoCard = styled.div`
  background: #F8F9FA;
  border-radius: 12px;
  padding: 16px;
`;

const AgoraHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 12px;
`;

const AgoraTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.gray};
  flex: 1; margin-right: 12px;
`;

const StatusBadge = styled.div`
  padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;
  background-color: ${({ $status }) => {
    switch ($status) {
      case 'WAITING': return '#4DB985';
      case 'PROGRESS': return '#F83001';
      case 'ENDED': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  }};
  color: #fff;
`;

const AgoraDescription = styled.p`
  font-size: 14px; color: ${({ theme }) => theme.gray};
  line-height: 1.5; margin-bottom: 16px;
`;

const AgoraDetails = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex; align-items: center; gap: 8px;
`;

const IconWrapper = styled.div`
  width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;
`;

const DetailText = styled.span`
  font-size: 14px; color: ${({ theme }) => theme.gray};
`;

const ParticipantInfo = styled.div`
  display: flex; flex-direction: column; gap: 8px;
`;

const ParticipantRow = styled.div`
  display: flex; flex-direction: column; gap: 4px;
`;

const ParticipantLabel = styled.span`
  font-size: 12px; color: ${({ theme }) => theme.lightGray};
  font-weight: 600;
`;

const ParticipantCount = styled.span`
  font-size: 14px; font-weight: 500; color: ${({ theme }) => theme.gray};
`;

const ActionButtons = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const ActionButton = styled.button`
  width: 100%; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: 600; border: none; cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${({ $variant, theme }) => $variant === 'primary'
    ? `background: linear-gradient(180deg, rgba(6, 6, 250, 0.6) -5.91%, rgba(132, 132, 255, 0.24) 121.16%); color:#fff;`
    : `background:#fff; color:${theme.gray}; border:1px solid ${theme.lightGray};`
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 12px;
  text-align: center;
`;

const EmptyText = styled.div`
  font-size: 16px; font-weight: 600; color: ${({ theme }) => theme.gray};
`;

const EmptySubText = styled.div`
  font-size: 14px; color: ${({ theme }) => theme.lightGray};
`;