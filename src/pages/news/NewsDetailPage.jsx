import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import NewsDetailContent from '../../components/news/detail/NewsDetailContent';
import back from "../../assets/icons/back.png";
import bookmark_outline from "../../assets/icons/bookmark_outline.png";
import bookmark_filled from "../../assets/icons/bookmark_filled.png";
import AiButton from '../../components/news/main/AiButton';

import { useParams } from 'react-router-dom';
import api from '../../api/api';

const mockArticle = {
  id: 1,
  title: "AI 기술이 바꾸는 미래 산업 구조",
  content: `인공지능(AI) 기술의 발전은 전 세계 산업 구조를 빠르게 재편하고 있습니다.
특히 금융, 의료, 제조 분야에서 자동화와 데이터 기반 의사결정이 가속화되고 있으며,
AI 윤리와 데이터 보안 문제에 대한 논의도 활발히 진행 중입니다.

한국은 글로벌 AI 경쟁력 강화 전략을 수립하며,
정부 차원의 인재 양성과 투자 확대를 추진하고 있습니다.`,
  summary: "AI 기술의 발전이 산업 구조를 변화시키고 있으며, 정부의 전략적 대응이 강조되고 있다.",
  articleCategory: "IT/과학",
  link: "https://example.com/article/ai-future",
  likeCount: 42,
  viewCount: 5300,
  publishDate: "2025-07-23T10:35:00.000Z",
};


const NewsDetailPage = () => {
  const [bookmarked, setBookmarked] = useState(false);

  const [openSummary, setOpenSummary] = useState(false);
  const [keywords, setKeywords] = useState([]);      // 핵심 단어 결과
  const [keywordsLoading, setKeywordsLoading] = useState(false); // 로딩 상태
  const [keywordsError, setKeywordsError] = useState(null);      // 에러 상태

  const [article, setArticle] = useState(null);
  const [articleLoading, setArticleLoading] = useState(true);
  const [error, setError] = useState(null);
  const summaryRef = useRef(null);

  const [memos, setMemos] = useState([]);
  const [memosLoading, setMemosLoading] = useState(true);

  const { articleId } = useParams();

  const toggleBookmark = () => setBookmarked(v => !v);
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBookmark();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (summaryRef.current && !summaryRef.current.contains(e.target)) {
        setOpenSummary(false);
      }
    };

    if (openSummary) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSummary]);

  // 기사 데이터 불러오기
  async function getArticle() {
    if (!articleId) return;
    setArticleLoading(true);

    try {
      const res = await api.get(`/api/articles/${articleId}`);
      console.log("기사 상세 조회 API 요청 성공:", res.data.response);
      setArticle(res.data.response);
    } catch (err) {
      console.error("API 요청 실패:", err);
    } finally {
      setArticleLoading(false);
    }
  }
  useEffect(() => {
    if (articleId) getArticle();
  }, [articleId]);

  // 메모 데이터 불러오기
  async function getMemos() {
    if (!articleId) return;
    setMemosLoading(true);

    try {
      const res = await api.get(`/api/articles/${articleId}/memos`);
      console.log("해당 기사의 메모 리스트 조회 API 요청 성공:", res.data.response);
      setMemos(res.data.response.memoList);
    } catch (err) {
      console.error("API 요청 실패:", err);
    } finally {
      setMemosLoading(false);
    }
  }
  useEffect(() => {
    if (articleId) getMemos();
  }, [articleId]);



  // 기사 핵심 단어 불러오기 
  async function getMainKeywords() {
    // 이미 핵심 단어가 있으면 재요청하지 않음
    if (keywords.length > 0) {
      return;
    }

    setKeywordsLoading(true);
    setKeywordsError(null);

    try {
      const res = await api.get(`/api/articles/${articleId}/core/word`);
      console.log("핵심 단어 API 요청 성공:", res.data.response.coreWordList);
      setKeywords(res.data.response.coreWordList);
      setOpenSummary(true);
    } catch (err) {
      console.error("❌ 핵심 단어 요청 실패:", err);
      setKeywordsError("핵심 단어를 불러오지 못했습니다.");
    } finally {
      setKeywordsLoading(false);
    }
  }

  // 기사 스크랩 하기 
  async function toggleScrap() {
    // 이미 스크랩된 상태이면 해제 요청
    if (bookmarked) {
      setBookmarked(false);
      try {
        const res = await api.delete(`/api/articles/${articleId}/scrap`);
        console.log("스크랩 취소 API 요청 성공:", res.data);
      } catch (err) {
        console.error("❌ 스크랩 취소 요청 실패:", err);
      }
    }
    // 스크랩되지 않은 상태이면 스크랩 요청
    else {
      setBookmarked(true);
      try {
        const res = await api.post(`/api/articles/${articleId}/scrap`,
          {
            memo: ""
          }
        );
        console.log("스크랩 API 요청 성공:", res.data);
      } catch (err) {
        console.error("❌ 스크랩 요청 실패:", err);
      }
    }
  }

  return (
    <>
      <HeaderContainer>
        <BackIcon src={back} alt="뒤로가기" />
        <Title>news</Title>
        <BookmarkImg
          src={bookmarked ? bookmark_filled : bookmark_outline}
          alt={bookmarked ? '북마크됨' : '북마크'}
          role="button"
          aria-pressed={bookmarked}
          tabIndex={0}
          onClick={toggleScrap}
          onKeyDown={handleKey}
          draggable={false}
        />
      </HeaderContainer>
      {article && !memosLoading && (
        <NewsDetailContent article={article} memos={memos} setMemos={setMemos} />
      )}
      <AiButton onClick={() => setOpenSummary((v) => !v)} />



      {openSummary && (
        <SummaryBox ref={summaryRef}>
          <SummaryTitle>AI 요약</SummaryTitle>
          <SummaryText>
            {article ? article.summary : "요약 내용을 불러오는 중입니다..."}
          </SummaryText>
        </SummaryBox>
      )}

      <ButtonContainer>
        <AgoraButton variant="secondary">아고라 생성하기</AgoraButton>
        <AgoraButton variant="primary">아고라 참여하기</AgoraButton>
      </ButtonContainer>

    </>

  );
};





export default NewsDetailPage;



const HeaderContainer = styled.header`
  text-align: center;
  padding-top: 10px;
  padding-bottom: 37px;
  display : flex;
  padding-left: 36px;
  padding-right: 30px;
  flex-direction: row;
  align-items : center;
  justify-content: space-between;
`;

const Title = styled.h1`
  background: linear-gradient(180deg, rgba(6, 6, 250, 0.6) 27.08%, rgba(132, 132, 255, 0.24) 143.75%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-family: 'godoRoundedR';
  font-weight: 400;
  font-size: 28px;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  margin: 0;
`;


const BackIcon = styled.img`
  width: auto;
  height: 10px;
`;

const BookmarkImg = styled.img`
  width: auto;
  height: 15px;
   &:focus-visible {
    outline: 2px solid rgba(6, 6, 250, 0.6);
    outline-offset: 2px;
  }
`;

const SummaryBox = styled.div`
  position: fixed; 
  width: 340px;
  height: auto;

  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);

  flex-shrink: 0;
  padding: 12px 12px 11px 16px;  
  box-sizing: border-box;

  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  background: linear-gradient(179deg, rgba(132, 132, 255, 0.04) 5.35%, rgba(6, 6, 250, 0.10) 142.35%), #FFF;
  backdrop-filter: blur(1px);

  z-index: 2000; 
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 3.68px;
  align-items: flex-start;


`;

const SummaryTitle = styled.h1`

  color: #8484FF;
  font-family: 'Pretendard';
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.24px;
  margin: 0;

`;

const SummaryText = styled.p`

  color: #666;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  letter-spacing: 0.2px;
  white-space: pre-line; /* \n → 실제 줄바꿈으로 표시됨 */

  margin: 0;


`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 95px;
  padding: 0 20px;
`;

const AgoraButton = styled.button`

  width: 100%;
  height: 42px;

  border-radius: 40px;
  border: none;

  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  letter-spacing: 0.28px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background-color: #cfcfcf;
  }
    ${({ variant, theme }) => {
    switch (variant) {
      case "primary":
        return `
                background: ${theme.mainLight};
                color: #fff;
                border: 0.5px solid ${theme.mainLight};
                `;
      case "secondary":
        return `
                background: #FFF;
                color: ${theme.mainLight};
                box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.16);
                `;
    }
  }}

    /* disabled 상태 스타일 */
    &:disabled {
        background: #ccc;
        color: #777;
        cursor: not-allowed;
        border: none;
        opacity: 0.7;
    }
`;