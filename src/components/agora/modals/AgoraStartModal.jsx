import styled from 'styled-components';
import BaseModal from '../../common/BaseModal';
import { AgoraStatus } from '../AgoraCard';
import userProfileMain from '../../../assets/icons/userProfileMain.svg';
import clockIcon from '../../../assets/icons/clock.svg';
import ModalButton from '../../common/ModalButton';
import api from '../../../api/api';
import { useState, useEffect } from 'react';
import { useAgoraStatus } from '../../../contexts/AgoraStatusContext';
import { useNavigate } from 'react-router-dom';

const AgoraStartModal = ({ isOpen, onClose, agora }) => {
    const navigate = useNavigate();
    const [agoraDetail, setAgoraDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const { connectWebSocket } = useAgoraStatus();

    const getAgoraDetail = async (agoraId) => {
        if (!agoraId) return;

        setLoading(true);
        try {
            const res = await api.get(`/api/agoras/${agoraId}`);
            console.log(res.data);
            setAgoraDetail(res.data.response);
        } catch (error) {
            console.error('아고라 상세 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && agora?.id) {
            getAgoraDetail(agora.id);
        }
    }, [isOpen, agora?.id]);

    // 시간 포맷팅 함수
    const formatTime = (timeArray) => {
        if (!timeArray || timeArray.length < 6) return '방장시작';
        const [, , , hour, minute] = timeArray;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    // 토론 타입 변환 함수
    const getDebateTypeText = (debateType) => {
        return debateType === 'PROS_CONS' ? '찬/반' : '자유';
    };

    // 상태 변환 함수
    const getStatusText = (status) => {
        return status === 'WAITING' ? '대기중' : '진행중';
    };

    // 토론방 참여 함수 (찬성/반대)
    const handleJoinAgora = async (side) => {
        if (!agoraDetail) return;

        try {
            // API 요청으로 토론방 참여
            const response = await api.post(`/api/agoras/${agoraDetail.id}/join`, {
                agoraId: agoraDetail.id,
                side: side
            });

            console.log('토론방 참여 성공:', response.data);

            const userId = localStorage.getItem('userId');

            // WebSocket 연결 (참가자로 연결)
            connectWebSocket(agoraDetail.id, userId, false);

            // 참여 완료 토스트 알림 표시
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 16px;
                right: 16px;
                background: #8484FF;
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-weight: 500;
                animation: slideUp 0.3s ease-out;
                text-align: center;
                font-size: 12px;
            `;
            notification.textContent = '토론방 참여 완료! 방장이 토론을 시작하면 자동으로 이동합니다.';
            document.body.appendChild(notification);

            // 3초 후 알림 제거
            setTimeout(() => {
                notification.style.animation = 'slideDown 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);

            // 모달만 닫고 페이지 이동은 하지 않음 (대기실에서 기다림)
            onClose();
        } catch (error) {
            console.error('토론방 참여 실패:', error);
            alert('토론방 참여에 실패했습니다.');
        }
    };

    // 관전하기 함수
    const handleWatchAgora = async () => {
        if (!agoraDetail) return;

        try {
            // API 요청으로 관전하기
            const response = await api.post(`/api/agoras/${agoraDetail.id}/join`, {
                agoraId: agoraDetail.id,
                side: "OBSERVER"
            });

            console.log('관전하기 성공:', response.data);

            const userId = localStorage.getItem('userId');

            // WebSocket 연결 (관전자로 연결)
            connectWebSocket(agoraDetail.id, userId, false);

            // 관전 완료 토스트 알림 표시
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 16px;
                right: 16px;
                background: #4DB985;
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-weight: 500;
                animation: slideUp 0.3s ease-out;
                text-align: center;
            `;
            notification.textContent = '토론방 관전 완료! 방장이 토론을 시작하면 자동으로 이동합니다.';
            document.body.appendChild(notification);

            // 3초 후 알림 제거
            setTimeout(() => {
                notification.style.animation = 'slideDown 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);

            // 모달만 닫고 페이지 이동은 하지 않음 (대기실에서 기다림)
            onClose();
        } catch (error) {
            console.error('관전하기 실패:', error);
            alert('관전하기에 실패했습니다.');
        }
    };

    if (loading) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose}>
                <AgoraStartModalContainer>
                    <div>로딩 중...</div>
                </AgoraStartModalContainer>
            </BaseModal>
        );
    }

    if (!agoraDetail) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose}>
                <AgoraStartModalContainer>
                    <div>아고라 정보를 불러올 수 없습니다.</div>
                </AgoraStartModalContainer>
            </BaseModal>
        );
    }
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <AgoraStartModalContainer>
                <HostBadge>
                    <IconWrapper>
                        <img src={userProfileMain} alt="user profile icon" />
                    </IconWrapper>
                    방장: {agoraDetail.hostNickname}
                </HostBadge>
                <TopicSection>
                    <TopicHeader>
                        <TopicTitle>주제 | <b>{agoraDetail.title}</b></TopicTitle>
                        <AgoraStatus $status={agoraDetail.status.toLowerCase()}>{getStatusText(agoraDetail.status)}</AgoraStatus>
                    </TopicHeader>
                    <TopicDescription>{agoraDetail.description}</TopicDescription>
                </TopicSection>

                <ArticleSection>
                    <ArticleButton>
                        <ArticleText onClick={() => navigate(`/news/${agoraDetail.articleId}`)}>
                            기사 원문 | <b>{agoraDetail.articleTitle}</b>
                        </ArticleText>
                        <ArrowIcon>→</ArrowIcon >
                    </ArticleButton>
                    <AiSummaryCard>
                        <SummaryTitle>AI 원문 요약</SummaryTitle>
                        <SummaryContent>{agoraDetail.articleSummary}</SummaryContent>
                    </AiSummaryCard>
                </ArticleSection>

                <AgoraInfoCard>
                    <Left>
                        <TimeRow>
                            <IconWrapper>
                                <img src={clockIcon} alt="clock icon" />
                            </IconWrapper>
                            <span>정보</span>
                        </TimeRow>
                        <div>
                            <TextRow>
                                토론시작 <b>{formatTime(agoraDetail.startedAt)}</b>
                            </TextRow>
                            <TextRow>
                                토론형식 <b>{getDebateTypeText(agoraDetail.debateType)}</b>
                            </TextRow>
                        </div>
                    </Left>

                    <Right>
                        {agoraDetail.debateType === 'PROS_CONS' ? (
                            <>
                                <VoteRow>
                                    <span><b>찬성</b> {agoraDetail.prosCount} / {agoraDetail.proMaxCount}</span>
                                    <VoteButton
                                        active={agoraDetail.userSide === 'PROS'}
                                        onClick={() => handleJoinAgora('PROS')}
                                    >
                                        참여하기
                                    </VoteButton>
                                </VoteRow>
                                <VoteRow>
                                    <span><b>반대</b> {agoraDetail.consCount} / {agoraDetail.conMaxCount}</span>
                                    <VoteButton
                                        active={agoraDetail.userSide === 'CONS'}
                                        onClick={() => handleJoinAgora('CONS')}
                                    >
                                        참여하기
                                    </VoteButton>
                                </VoteRow>
                            </>
                        ) : (
                            <VoteRow>
                                <span><b>자유토론</b> {agoraDetail.participantCount} / {agoraDetail.maxParticipants}</span>
                                <VoteButton
                                    active={agoraDetail.userSide === 'PARTICIPANT'}
                                    onClick={() => handleJoinAgora('PARTICIPANT')}
                                >
                                    참여하기
                                </VoteButton>
                            </VoteRow>
                        )}
                    </Right>
                </AgoraInfoCard>

                <Notice>* 참여, 관전 대기 중 방장이 시작을 누르면 아고라가 시작됩니다.</Notice>

                <ButtonContainer>
                    <ModalButton variant="primary" onClick={handleWatchAgora}>관전하기</ModalButton>
                    <ModalButton variant="secondary" onClick={onClose}>닫기</ModalButton>
                </ButtonContainer>

            </AgoraStartModalContainer>
        </BaseModal >
    )
}

export default AgoraStartModal;

const AgoraStartModalContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const HostBadge = styled.div`
    padding: 6px 8px;
    display: flex;
    gap: 4px;
    align-items: center;
    border-radius: 32px;
    border: 0.5px solid ${(theme) => theme.mainLight};
    color: ${({ theme }) => theme.mainLight};
    font-size: 10px;
    font-weight: 300;
`;

const IconWrapper = styled.div`
    width: 12px;
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TopicSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
`;

const TopicHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const TopicTitle = styled.span`
    font-weight: 300;
    font-size: 14px;
    color: ${({ theme }) => theme.gray};
    letter-spacing: -0.02em;

    b {
        font-weight: 700;
    }
`;

const TopicDescription = styled.span`
    font-weight: 400;
    font-size: 12px;
    color: ${({ theme }) => theme.gray};
`;

const ArticleSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: 4px;
    margin-top: 8px;
`;

const ArticleButton = styled.div`
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    background-color: ${({ theme }) => theme.mainLight};
    border-radius: 5px;
    color: white;
`;

const ArticleText = styled.span`
    font-size: 10px;
    font-weight: 300;
    color: #fff;
    letter-spacing: -0.02em;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    b {
        font-weight: 700;
        text-decoration: underline;
    }
`;

const ArrowIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #fff;
    color: ${({ theme }) => theme.mainLight};
    flex-shrink: 0;
`;

const AiSummaryCard = styled.div`
    background: linear-gradient(180deg, rgba(132, 132, 255, 0.04) 5.35%, rgba(6, 6, 250, 0.1) 142.35%);
    padding: 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 75px;
`;

const SummaryTitle = styled.div`
    font-size: 8px;
    font-weight: 700;
    color: ${({ theme }) => theme.mainLight};
`;

const SummaryContent = styled.div`
    font-size: 10px;
    font-weight: 300;
    color: ${({ theme }) => theme.gray};
    line-height: 1.4em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
`;

const AgoraInfoCard = styled.div`
    display: flex;
    justify-content: space-between;
    background: #F4F4F4;
    border-radius: 5px;
    padding: 10px 12px;
    width: 100%;
    margin-top: 4px;
    color: ${({ theme }) => theme.gray};
`;

const Left = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Right = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
`;

const TimeRow = styled.div`
    font-weight: 400;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
`;

const TextRow = styled.div`
    font-size: 10px;
    line-height: 1.4em;
    letter-spacing: 0.02em;

    b {
        font-weight: 700;
    }
`;

const VoteRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    span {
        font-size: 12px;
        font-weight: 300;
        letter-spacing: -0.02em;

        b {
            font-weight: 700;
        }
    }
`;

const VoteButton = styled.button`
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: -0.02em;
  background: #FFF;

  color: ${({ active, theme }) => (active ? theme.mainLight : theme.gray)};
  border: 0.25px solid ${({ active, theme }) => (active ? theme.mainLight : theme.gray)};
`;

const Notice = styled.div`
    font-size: 10px;
    color: ${({ theme }) => theme.gray};
    margin: 8px 0 12px 0;
    text-align: center;
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 16px;
    justify-content: space-between;
`;

const Button = styled.button`
    border-radius: 12px;
    width: 100%;
    padding: 8px 36px;

    ${({ variant, theme }) => {
        switch (variant) {
            case "primary":
                return `
                background: rgba(132, 132, 255, 0.8);
                color: #fff;
                border: 0.5px solid ${theme.mainLight};
                `;
            case "secondary":
                return `
                background: #FFF;
                color: ${theme.mainLight};
                border: 0.5px solid ${theme.mainLight};
                `;
        }
    }}
`;
