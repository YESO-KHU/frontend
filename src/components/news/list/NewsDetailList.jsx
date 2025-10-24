import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

// onSelect : 아이템 클릭 시 실행할 함수 
const NewsDetailList = ({ showTime = true, onSelect, searchQuery = '' }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    // // 카테고리 매핑
    // const categoryMapping = {
    //     'POLITICS': '정치',
    //     'ECONOMY': '경제',
    //     'SOCIETY': '사회',
    //     'CULTURE': '문화',
    //     'IT': 'IT/과학',
    //     'GLOBAL': '글로벌',
    //     'ETC': '이슈',
    // };

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
    const getArticles = useCallback(async () => {
        // 검색어가 없으면 요청하지 않음
        if (!searchQuery.trim()) {
            setArticles([]);
            return;
        }

        try {
            setLoading(true);
            const params = {
                page: 1,
                size: 20,
                search: searchQuery.trim()
            };

            const res = await api.get('/api/articles', { params });

            if (res.data.isSuccess) {
                console.log(res.data.response.articleList);
                setArticles(res.data.response.articleList);
            }
        } catch (error) {
            console.error('기사 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        getArticles();
    }, [searchQuery, getArticles]);

    const handleItemClick = (articleId) => {
        setSelectedId(articleId);
        if (onSelect) {
            onSelect(articleId);
        } else {
            navigate(`/news/${articleId}`);
        }
    }

    // 검색어가 없으면 아무것도 표시하지 않음
    if (!searchQuery.trim()) {
        return (
            <NewsDetailListContainer>
                <EmptyText>검색어를 입력해주세요</EmptyText>
            </NewsDetailListContainer>
        );
    }

    if (loading) {
        return (
            <NewsDetailListContainer>
                <LoadingText>로딩 중...</LoadingText>
            </NewsDetailListContainer>
        );
    }

    // 검색어가 있는데 결과가 없는 경우
    if (articles.length === 0) {
        return (
            <NewsDetailListContainer>
                <NoResultsText>검색 결과가 없습니다</NoResultsText>
            </NewsDetailListContainer>
        );
    }

    return (
        <NewsDetailListContainer>
            {articles.map((article) => (
                <NewsDetailItem
                    key={article.id}
                    onClick={() => handleItemClick(article.id)}
                    $isSelected={selectedId === article.id}
                >
                    {/* <Category>{categoryMapping[article.category] || '기타'}</Category> */}
                    <ContentContainer>
                        <Title>{cleanText(article.title)}</Title>
                        <Content>{cleanText(article.content)}</Content>
                    </ContentContainer>
                    {showTime && <Time>{formatDate(article.publishDate)}</Time>}
                </NewsDetailItem>
            ))}
        </NewsDetailListContainer>
    )
}

export default NewsDetailList;

const NewsDetailListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 16px;
    overflow-y: auto; /* 스크롤 가능하도록 설정 */
`;

// align-items: baseline나 텍스트들의 line-height을 통일해야 텍스트들이 수평으로 정렬됨 
const NewsDetailItem = styled.div`
    display: flex;
    border-bottom: 0.2px solid rgb(205, 205, 205);  
    padding-bottom: 16px;
    height: 56px;
    width: 100%;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    background: ${({ $isSelected, theme }) =>
        $isSelected ? theme.lightGray : "#fff"};
    
    color: ${({ $isSelected }) => ($isSelected ? "#fff" : "#333")};
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 4px;
    flex: 1;
`;

const Title = styled.span`
    color: ${({ theme }) => theme.gray};
    font-weight: 600;
    font-size: 12px;
`;

const Content = styled.span`
    color: ${({ theme }) => theme.gray};
    font-weight: 300;
    font-size: 12px;
    text-align: left;

    display: -webkit-box; /* flexbox와 유사한 레이아웃 모드 */
    -webkit-line-clamp: 3;   /* 최대 3줄 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis; /* 넘치는 부분 … 처리 */
`;

const Time = styled.span`
    color: ${({ theme }) => theme.gray};
    font-weight: 300;
    font-size: 12px;
    text-align: right;
    min-width: 86px;
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.gray};
    font-size: 14px;
`;

const NoResultsText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.gray};
    font-size: 14px;
    font-weight: 500;
`;

const EmptyText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.gray};
    font-size: 14px;
    font-weight: 300;
`;