import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import NewsList from '../../components/news/main/NewsList';
import AgoraLink from '../../components/news/main/AgoraLink';
import Footer from '../../components/common/Footer';
import ListItem from '../../components/common/ListItem';
import api from '../../api/api';

const NewsPage = () => {
  const userName = localStorage.getItem('nickname');
  const [recommendArticles, setRecommendArticles] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getRecommendArticle = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/recommend/article");
      if (res.data.isSuccess) {
        setRecommendArticles(res.data.response.articleList);
      }
    } catch (err) {
      console.error("API 요청 실패:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRecommendArticle();
  }, [])

  return (
    <PageContainer>
      <Header content='news' />
      <ContentContainer>
        <SearchBar />
        <NewsList />
        <AgoraLink />
      </ContentContainer>
      <Title>{userName}님을 위한 추천 뉴스✨</Title>
      <ListCard>
        {loading ? (
          <LoadingText>추천 뉴스를 불러오는 중...</LoadingText>
        ) : recommendArticles.length === 0 ? (
          <EmptyText>추천 뉴스가 없습니다.</EmptyText>
        ) : (
          recommendArticles.map((article, index) => (
            <ListItem
              categoryVisible={false}
              key={article.id}
              id={article.id}
              time={formatDate(article.publishDate)}
              category={article.articleCategory}
              title={cleanText(article.title)}
              preview={cleanText(article.content)}
              isLast={index === recommendArticles.length - 1}
            />
          ))
        )}
      </ListCard>
      <Footer />
    </PageContainer>
  );
};

export default NewsPage;

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 0 26px 120px 26px;
  background: linear-gradient(180deg, rgba(6, 6, 250, 0) 0%, rgba(22, 6, 250, 0.2) 100%), #FFFFFF;
`;

const Title = styled.div`
  color: rgba(6, 6, 250, 0.60);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.36px;
  margin-top: 40px;
  margin-left: 5px;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ListCard = styled.div`
  margin-top: 16px;
  padding: 8px 28px;  
  border-radius: 22px;
  background: #FFF;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.10);
`;

const LoadingText = styled.div`
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px;
`;

const EmptyText = styled.div`
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px;
`;
