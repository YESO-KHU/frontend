// pages/my/MyPage.tsx
import styled from "styled-components";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import ListItem from "../../components/common/ListItem";
import InterestChart from "../../components/news/main/InterestChart";
import RecommendationCard from "../../components/news/main/RecommendationCard";
import api from "../../api/api";
import { useEffect, useState } from "react";

const MyPage = () => {
  const [scrapArticles, setScrapArticles] = useState([]);
  const [userStats, setUserStats] = useState(null);

  const formatDate = (publishDate) => {
    if (!publishDate || publishDate.length < 5) return '';
    const [year, month, day, hour, minute] = publishDate;
    const now = new Date();
    const articleDate = new Date(year, month - 1, day, hour, minute);
    const diffMs = now - articleDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}일 전`;
    }
  };

  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ');
  };

  const getScrapArticles = async () => {
    try {
      const res = await api.get("/api/scraps");
      if (res.data.isSuccess) {
        setScrapArticles(res.data.response.scrapList);
      }
    } catch (err) {
      console.error("스크랩 목록 조회 실패:", err);
    }
  }

  const getUserStats = async () => {
    try {
      const res = await api.get("/api/stats/article");
      if (res.data.isSuccess) {
        setUserStats(res.data.response);
        console.log("사용자 통계:", res.data.response);
      }
    } catch (err) {
      console.error("사용자 통계 조회 실패:", err);
    }
  }

  useEffect(() => {
    getScrapArticles();
    getUserStats();
  }, []);

  return (
    <PageContainer>
      <Inner>
        <Header content='my' />
        <ProfileCard>
          <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400" />
          <ProfileTexts>
            <JoinedDate>2025. 10. 24. 가입</JoinedDate>
            <Nickname>{userStats?.nickName || '사용자'}</Nickname>
            <Interests>
              {userStats ?
                `(관심분야) ${userStats.firstViewedArticleCategory} / ${userStats.secondViewedArticleCategory}`
                : '(관심분야) 로딩 중...'
              }
            </Interests>
          </ProfileTexts>
        </ProfileCard>
        <ContentSection>
          <InterestChart userStats={userStats} />
          <RecommendationCard userStats={userStats} />
        </ContentSection>
        <ListCard>
          {scrapArticles.length > 0 ? scrapArticles.map((article, index) => (
            <ListItem
              key={article.id}
              id={article.id}
              category="스크랩"
              title={cleanText(article.title)}
              time={formatDate(article.publishDate)}
              isLast={index === scrapArticles.length - 1}
            />
          )) : <EmptyText>스크랩한 기사가 없습니다.</EmptyText>}
        </ListCard>
      </Inner>
      <Footer />
    </PageContainer>
  );
};

export default MyPage;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  /* 하단 바텀바 높이만큼 여백 */
  padding: 0 0 120px 0;
`;

const Inner = styled.div`
  padding: 0 26px;
`;

const ContentSection = styled.div`
  display: flex;
  height: 100%;
  gap: 20px;
`;

/* 프로필 카드 */
const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  padding: 23px 30px;
  gap: 30px;
  border-radius: 22px;
  background: #FFF;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.10);
  margin-bottom: 24px;
`;

const Avatar = styled.img`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProfileTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #888;
`;

const JoinedDate = styled.span`
  font-size: 8px;
  color: #9aa0a6;
`;

const Nickname = styled.h3`
  font-size: 20px;
  font-weight: 700;
`;

const Interests = styled.span`
  font-size: 12px;
  font-weight: 300;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InterestIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

/* 리스트 카드 */
const ListCard = styled.div`
  margin-top: 24px;
  padding: 8px 28px;  
  border-radius: 22px;
  background: #FFF;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.10);
`;

const EmptyText = styled.div`
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px;
`;