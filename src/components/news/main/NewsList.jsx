import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // 시간 포맷팅 함수
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

  // 텍스트 정리 함수
  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ');
  };

  // 기사 데이터 가져오기
  const getArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/articles', {
        params: {
          page: 1,
          size: 4
        }
      });

      if (res.data.isSuccess) {
        setArticles(res.data.response.articleList);
      }
    } catch (error) {
      console.error('기사 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  const handleArticleClick = (articleId) => {
    navigate(`/news/${articleId}`);
  };

  if (loading) {
    return (
      <NewsCard>
        <LoadingText>로딩 중...</LoadingText>
      </NewsCard>
    );
  }

  return (
    <NewsCard>
      {articles.map((article) => (
        <NewsItem
          key={article.id}
          onClick={() => handleArticleClick(article.id)}
        >
          <Content>{cleanText(article.title)}</Content>
          <Time>{formatDate(article.publishDate)}</Time>
        </NewsItem>
      ))}
    </NewsCard>
  );
};

export default NewsList;


const NewsCard = styled.div`
  background: white;
  border-radius: 22px;
  box-shadow: 0px 1px 10px 0px #0000001A;
  padding: 10px 20px;
`;

const NewsItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 0.2px solid rgb(205, 205, 205);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Category = styled.span`
  color: ${({ theme }) => theme.gray};
  font-weight: 300;
  font-size: 12px;
  min-width: 60px;
`;

const Content = styled.span`
  color: ${({ theme }) => theme.gray};
  font-weight: 500;
  font-size: 12px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Time = styled.span`
  color: ${({ theme }) => theme.gray};
  font-size: 12px;
  font-weight: 300;
  text-align: right;
  min-width: 60px;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.gray};
  font-size: 14px;
`;
