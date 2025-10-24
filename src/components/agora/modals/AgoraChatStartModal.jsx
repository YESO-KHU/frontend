import React from "react";
import styled from "styled-components";
import BaseModal from "../../common/BaseModal";
import ModalButton from "../../common/ModalButton";
import AgoraChatModalBase from "./AgoraChatModalBase";

const AgoraChatStartModal = ({ isOpen, onClose, agoraDetail }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <ModalContainer>
                <AgoraChatModalBase
                    title="토론 시작 안내"
                    description="안녕하세요, 참여자 여러분들! 지금부터 토론을 시작하도록 하겠습니다. 토론은 입장발언 -> 본토론 -> 마무리 발언 순으로 진행됩니다. 자신의 의견을 논리적으로 펼쳐보세요!"
                >
                    <ScrollableContent>
                        {agoraDetail?.response && (
                            <>
                                <InfoBox>
                                    <InfoTitle>토론 주제</InfoTitle>
                                    <InfoContent>{agoraDetail.response.title}</InfoContent>
                                </InfoBox>

                                <InfoBox>
                                    <InfoTitle>원문</InfoTitle>
                                    <InfoContent>{agoraDetail.response.description}</InfoContent>
                                </InfoBox>

                                <InfoBox>
                                    <InfoTitle>기사 제목</InfoTitle>
                                    <InfoContent>{agoraDetail.response.articleTitle}</InfoContent>
                                </InfoBox>

                                <InfoBox>
                                    <InfoTitle>AI 요약</InfoTitle>
                                    <InfoContent>
                                        {agoraDetail.response.articleSummary ?
                                            (agoraDetail.response.articleSummary.length > 200 ?
                                                agoraDetail.response.articleSummary.substring(0, 200) + '...' :
                                                agoraDetail.response.articleSummary
                                            ) :
                                            'AI 요약이 없습니다.'
                                        }
                                    </InfoContent>
                                </InfoBox>

                                <InfoBox>
                                    <InfoTitle>참여자 정보</InfoTitle>
                                    <ParticipantInfo>
                                        <ParticipantGroup>
                                            <ParticipantLabel>찬성</ParticipantLabel>
                                            <ParticipantCount>{agoraDetail.response.prosCount || 0}명</ParticipantCount>
                                        </ParticipantGroup>
                                        <ParticipantGroup>
                                            <ParticipantLabel>반대</ParticipantLabel>
                                            <ParticipantCount>{agoraDetail.response.consCount || 0}명</ParticipantCount>
                                        </ParticipantGroup>
                                        {agoraDetail.response.debateType !== 'PROS_CONS' && (
                                            <ParticipantGroup>
                                                <ParticipantLabel>자유형식</ParticipantLabel>
                                                <ParticipantCount>{agoraDetail.response.participantCount || 0}명</ParticipantCount>
                                            </ParticipantGroup>
                                        )}
                                        <ParticipantGroup>
                                            <ParticipantLabel>관전자</ParticipantLabel>
                                            <ParticipantCount>{agoraDetail.response.observerCount || 0}명</ParticipantCount>
                                        </ParticipantGroup>
                                    </ParticipantInfo>
                                </InfoBox>

                                <InfoBox>
                                    <InfoTitle>참여자 목록</InfoTitle>
                                    <ParticipantList>
                                        {agoraDetail.response.participants?.map((participant) => (
                                            <ParticipantItem key={participant.id}>
                                                <ParticipantAvatar>
                                                    {participant.userProfileImage ? (
                                                        <img src={participant.userProfileImage} alt="profile" />
                                                    ) : (
                                                        <div className="default-avatar">
                                                            {participant.userNickname?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                </ParticipantAvatar>
                                                <ParticipantDetails>
                                                    <ParticipantName>
                                                        {participant.userNickname}
                                                        {participant.isHost && <HostBadge>방장</HostBadge>}
                                                    </ParticipantName>
                                                    <ParticipantSide $side={participant.side}>
                                                        {participant.side === 'PROS' ? '찬성' :
                                                            participant.side === 'CONS' ? '반대' :
                                                                participant.side === 'PARTICIPANT' ? '자유형식' : '관전자'}
                                                    </ParticipantSide>
                                                </ParticipantDetails>
                                            </ParticipantItem>
                                        ))}
                                    </ParticipantList>
                                </InfoBox>
                            </>
                        )}
                    </ScrollableContent>
                </AgoraChatModalBase>
                <ButtonContainer>
                    <ModalButton variant="primary" onClick={onClose}>
                        확인
                    </ModalButton>
                </ButtonContainer>
            </ModalContainer>
        </BaseModal>
    );
};

export default AgoraChatStartModal;

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    width: 100%;
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 16px;
`;

const ScrollableContent = styled.div`
    flex: 1;
    overflow-y: auto;
    max-height: 30vh;
    padding-right: 8px;
    
    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
`;

const InfoBox = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: ${({ theme }) => theme.gray};
  background: #F4F4F4;
  padding: 12px;
  border-radius: 5px;
  width: 100%;
  text-align: left;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const InfoTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
`;

const InfoContent = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #666;
  line-height: 1.4;
`;

const ParticipantInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ParticipantGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #E0E0E0;
  min-width: 60px;
`;

const ParticipantLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #666;
  margin-bottom: 2px;
`;

const ParticipantCount = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #E0E0E0;
`;

const ParticipantAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F0F0F0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .default-avatar {
    font-size: 14px;
    font-weight: 600;
    color: #666;
  }
`;

const ParticipantDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ParticipantName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HostBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  background: #4DB985;
  padding: 2px 6px;
  border-radius: 10px;
`;

const ParticipantSide = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${props => {
        switch (props.$side) {
            case 'PROS': return '#4DB985';
            case 'CONS': return '#F83001';
            case 'PARTICIPANT': return '#8484FF';
            case 'OBSERVER': return '#9E9E9E';
            default: return '#666';
        }
    }};
`;