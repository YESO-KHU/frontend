import { useLocation } from "react-router-dom";
import { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import BottomBar from "../main/BottomBar";
import MemoModal from "../main/MemoModal";
import api from "../../../api/api";


const fallbackNews = {
  id: 1,
  category: "경제",
  title: "금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목",
  content: `금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용

 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목ㅍ금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 

제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목
금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용

 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목ㅍ금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 

제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목`
};


const NewsDetailPage = () => {
  const location = useLocation();
  const news = location.state || fallbackNews;

  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [renderedContent, setRenderedContent] = useState(null);

  // 메모 가져오기
  const fetchMemos = async () => {
    try {
      const res = await api.get(`/api/articles/${news.id}/memos`);
      setMemos(res.data.response.memoList || []);
    } catch (err) {
      console.error("❌ 메모 조회 실패:", err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, [news.id]);

  // 실제 렌더된 텍스트 기준으로 하이라이트 표시
  useEffect(() => {
    const articleBody = document.querySelector(".article-body");
    if (!articleBody || !memos.length) {
      setRenderedContent(news.content);
      return;
    }

    const fullText = articleBody.textContent;
    const sorted = [...memos].sort((a, b) => a.startIndex - b.startIndex);
    const parts = [];
    let lastIndex = 0;

    sorted.forEach((memo) => {
      const { startIndex, endIndex, id } = memo;

      console.log(
      `🟨 메모 ${id}: start=${startIndex}, end=${endIndex}, text="${fullText.slice(
        startIndex,
        endIndex
      )}"`
    );

      parts.push(fullText.slice(lastIndex, startIndex));

      parts.push(
        <HighlightedText
          key={id}
          onClick={() => handleMemoClick(memo)}
          title="메모 보기"
        >
          {fullText.slice(startIndex, endIndex)}
        </HighlightedText>
      );

      lastIndex = endIndex;
    });

    parts.push(fullText.slice(lastIndex));
    setRenderedContent(parts);
  }, [memos]);

  // 하이라이트 클릭 → 메모 보기 모달
  const handleMemoClick = (memo) => {
    setSelectedMemo(memo);
    setShowModal(true);
  };

  // 모달 닫기 (수정/삭제 후 새로고침 없이 갱신)
  const handleModalClose = async (refresh = false) => {
    setShowModal(false);
    setSelectedMemo(null);
    if (refresh) await fetchMemos();
  };

  return (
    <Wrapper>
      <TopMeta>
        <Category>{news.category}</Category>
        <Date>2025. 7. 23.(수) 19:35</Date>
      </TopMeta>

      <Divider />
      <Title>{news.title}</Title>
      <SubMeta>
        <Author>무슨일보 / 누구누구 기자</Author>
        <View>view <strong>5,203</strong></View>
      </SubMeta>
      <Thumbnail />

      {/* 렌더링된 하이라이트 표시 */}
      <BodyText className="article-body">
        {renderedContent || news.content}
      </BodyText>

      <BottomBar articleId={news.id} />

      {showModal && (
        <MemoModal
          memo={selectedMemo}
          articleId={news.id}
          onClose={handleModalClose}
        />
      )}
    </Wrapper>
  );
};

export default NewsDetailPage;


const Wrapper = styled.div`
  padding: 24px;
  padding-bottom: 100px;
`;

const TopMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Category = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.gray};
`;

const Date = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.gray};
`;

const Title = styled.span`
  color: ${({ theme }) => theme.gray};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
  line-height: 1.4;
  `;


const SubMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.gray};
  margin-bottom: 24px;
  margin-top: 8px;
`;

const Author = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.gray};
`;


const View = styled.span`
  strong {
    font-weight: 600;
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 168px;
  background-color: #D9D9D9;
  margin-bottom: 24px;
`;

const BodyText = styled.div`
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-line;
  color: ${({ theme }) => theme.gray};
`;

const FixedButton = styled.button`
  width: 80px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 40px;

  border: none;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 40px;
  background: linear-gradient(179deg, rgba(132, 132, 255, 0.24) 5.35%, rgba(6, 6, 250, 0.60) 142.35%), #FFF;
  backdrop-filter: blur(1px);
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;

`;


const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 16px 0;
`;


const HighlightedText = styled.span`
  color: #4a7cff;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(74, 124, 255, 0.1);
  }
`;
