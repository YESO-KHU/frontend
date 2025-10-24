import styled from 'styled-components';
import Header from '../../components/common/Header';
import { useNavigate } from 'react-router-dom';

const AgoraDetailPage = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleGoToAgora = () => {
        navigate('/agora');
    };

    return (
        <PageContainer>
            <Header content="화제의 아고라" onClick={handleBackClick} />

            <ContentContainer>
                <CategoryRow>
                    <Category>토론</Category>
                    <DateTime>2025. 10. 24.(금) 19:35</DateTime>
                </CategoryRow>
                <Title>기술 발전, 규제는 필요한가?</Title>
                <MetaInfo>
                    <AgoraTag>
                        <SparkleIcon>✨</SparkleIcon>
                        agora
                    </AgoraTag>
                    <ViewCount>view 12</ViewCount>
                </MetaInfo>
                <Divider />
                <ArticleButton>
                    <ArticleText>기사 원문 | "AI 규제 논의, 어디까지 와있나"</ArticleText>
                    <ArrowIcon>→</ArrowIcon>
                </ArticleButton>

                <VoteBoxes>
                    <VoteBox>
                        <VoteText>찬성 2명</VoteText>
                    </VoteBox>
                    <VoteBox>
                        <VoteText>반대 2명</VoteText>
                    </VoteBox>
                </VoteBoxes>

                <SummarySection>
                    <SummaryText>
                        최근 전 세계적으로 AI 기술이 빠르게 확산되면서, 이에 대한 규제 필요성을 두고 다양한 의견이 나오고 있다.
                        이번 토론에는 총 10명이 참여했으며, 찬성 측은 규제가 필수적이라고 주장했고, 반대 측은 기술 발전을 막을 수 있다며 맞섰다.
                    </SummaryText>

                    <SummaryText>
                        찬성 측은 AI가 사회 전반에 미칠 영향이 매우 크기 때문에, 오·남용을 방지하는 장치가 반드시 필요하다고 강조했다.
                        특히 개인정보 침해, 허위 정보 생성, 노동 시장 변화 등 잠재적 위험 요소를 통제하지 않으면 부작용이 커질 수 있다고 지적했다.
                    </SummaryText>

                    <SummaryText>
                        반대 측은 과도한 규제가 기술 발전 속도를 늦추고, 글로벌 경쟁에서 뒤처질 수 있다고 주장했다.
                        또한 새로운 산업과 일자리를 만들어낼 수 있는 가능성을 제한하는 것은 오히려 사회적 손실이라고 주장했다.
                    </SummaryText>

                    <SummaryText>
                        토론이 진행되면서 양측은 "어디까지 규제할 것인지", "누가 기준을 정할 것인지"에 대한 현실적인 문제를 두고 의견을 이어갔다.
                        찬성 측은 단계적 규제 도입을 제안했고, 반대 측은 산업 자율 조정 시스템을 더 강화하는 방향을 제안했다.
                    </SummaryText>

                    <SummaryText>
                        이번 토론은 명확한 결론에 도달하기보다는, AI 규제에 대한 사회적 논의가 더욱 필요함을 확인하는 자리였다.
                        참가자들은 기술 발전과 안전 사이의 균형을 마련하는 것이 중요하다는 점에 공감하며 토론을 마무리했다.
                    </SummaryText>
                </SummarySection>
            </ContentContainer>

            <FooterButton onClick={handleGoToAgora}>
                지금 진행 중인 아고라 보러 가기
            </FooterButton>
        </PageContainer>
    );
};

export default AgoraDetailPage;

const PageContainer = styled.div`
  min-height: 100vh;
  background: white;
  padding-bottom: 100px;
`;

const ContentContainer = styled.div`
  padding: 20px 16px;
`;

const CategoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Category = styled.span`
  color: #999;
  font-size: 14px;
`;

const DateTime = styled.span`
  color: #999;
  font-size: 14px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AgoraTag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 12px;
`;

const SparkleIcon = styled.span`
  font-size: 12px;
`;

const ViewCount = styled.span`
  color: #999;
  font-size: 12px;
`;

const Divider = styled.div`
  height: 1px;
  background: #E0E0E0;
  margin-bottom: 20px;
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
    margin-bottom: 12px;
`;

const ArticleText = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 600;
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

const VoteBoxes = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const VoteBox = styled.div`
  flex: 1;
  background: #F5F5F5;
  border-radius: 8px;
  padding: 8px 16px;
  text-align: center;
`;

const VoteText = styled.span`
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SummaryText = styled.p`
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
`;

const FooterButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(6, 6, 250, 0.6) -5.91%, rgba(132, 132, 255, 0.24) 121.16%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 20px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;
