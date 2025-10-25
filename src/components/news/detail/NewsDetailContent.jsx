import { useLocation } from "react-router-dom";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import BottomBar from "../main/BottomBar";
import MemoModal from "../main/MemoModal";
import api from "../../../api/api";
import WordModal from "../main/WordModal";


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


const NewsDetailContent = ({ article, memos, setMemos }) => {
  const [openSummary, setOpenSummary] = useState(false);

  const [selectedMemo, setSelectedMemo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showWordModal, setShowWordModal] = useState(false);
  const [renderedContent, setRenderedContent] = useState(null);

  const [selectedText, setSelectedText] = useState("");
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [focusedMemoId, setFocusedMemoId] = useState(null);

  const news = article || fallbackNews;

  if (!article) return null;
  const content = article.content || "";

  // 본문 + 하이라이트 렌더링
  const renderWithHighlights = (text) => {
    if (!memos?.length) return text;

    const sorted = [...memos].sort((a, b) => a.startIndex - b.startIndex);
    const parts = [];
    let last = 0;

    sorted.forEach((m, i) => {
      if (m.startIndex > last) {
        parts.push(<span key={`text-${i}`}>{text.slice(last, m.startIndex)}</span>);
      }

      // 하이라이트된 영역 (<mark>) 클릭 시 MemoModal 띄움
      parts.push(
        <HighlightMark
          key={`memo-${m.id}`}
          onClick={() => {
            setSelectedMemo(m);
            setShowModal(true); // 클릭 시 모달 띄우기
            setFocusedMemoId(m.id); // 포커스 이동
          }}
          focused={m.id === focusedMemoId} // ✅ 현재 포커스 여부 전달
        >
          {text.slice(m.startIndex, m.endIndex)}
        </HighlightMark>
      );

      last = m.endIndex;
    });

    if (last < text.length) {
      parts.push(<span key="end">{text.slice(last)}</span>);
    }

    return parts;
  };

  // 모달 닫기 (수정/삭제 후 새로고침 없이 갱신)
  const handleModalClose = async (refresh = false) => {
    setShowModal(false);
    setSelectedMemo(null);
    if (refresh) await fetchMemos();
  };
  useEffect(() => {
    // 모바일/PC 환경 모두에서 텍스트 드래그(선택) 감지
    // iOS Safari에서는 mouseup 이벤트가 없고 selectionchange만 발생함
    // 따라서 두 이벤트를 병행 처리해야 함

    let touchSelecting = false; // 터치 중인지 여부
    let selectionTimeout; // 디바운싱 타이머

    //  selectionchange 이벤트 핸들러
    const handleSelectionChange = () => {
      // iOS Safari에서는 selectionchange가 여러 번 발생 → 디바운싱 필요
      clearTimeout(selectionTimeout);
      selectionTimeout = setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        // ✅ 선택 해제 시 상태 초기화
        if (!text) {
          setSelectedText("");
          setSelectedMemo(null);
          setFocusedMemoId(null);
          return;
        }

        // ✅ 실제 Range 객체 가져오기 (선택 영역 정보)
        try {
          const range = selection.getRangeAt(0);
          const bodyEl = document.getElementById("news-body"); // <BodyText id="news-body"> 필요
          if (!bodyEl) return;

          // ✅ 전체 본문 기준으로 startIndex / endIndex 계산
          const preSelectionRange = range.cloneRange();
          preSelectionRange.selectNodeContents(bodyEl);
          preSelectionRange.setEnd(range.startContainer, range.startOffset);
          const start = preSelectionRange.toString().length;
          const end = start + range.toString().length;

          setSelectedText(text);
          setRange({ start, end });

          // ✅ 이미 등록된 메모와 겹치는지 확인
          const found = memos.find((m) => m.startIndex < end && m.endIndex > start);

          if (found) {
            // 기존 메모 선택 상태로 전환
            setSelectedMemo(found);
            setSelectedText(found.content);
            setFocusedMemoId(found.id);
          } else {
            setSelectedMemo(null);
            setFocusedMemoId(null);
          }
        } catch (err) {
          console.warn("선택 영역 계산 실패:", err);
        }
      }, 150); // 디바운스 150ms
    };

    // 👆 터치 시작 시 플래그 설정 (모바일 감지용)
    const handleTouchStart = () => (touchSelecting = true);

    // 👇 터치 종료 후 selectionchange 이벤트 발생하므로 약간의 지연 후 실행
    const handleTouchEnd = () => {
      touchSelecting = false;
      setTimeout(handleSelectionChange, 200);
    };

    // 💻 PC/모바일 둘 다 대응하도록 이벤트 등록
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    // 💣 클린업 (컴포넌트 언마운트 시 제거)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(selectionTimeout);
    };
  }, [memos]);

  useEffect(() => {
    const bodyEl = document.getElementById("news-body");
    if (!bodyEl) return;

    let touchStartIndex = 0;
    let touchEndIndex = 0;

    // 터치 시작 지점 저장
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const range = document.caretRangeFromPoint(touch.clientX, touch.clientY);
      if (!range) return;
      const preRange = range.cloneRange();
      preRange.selectNodeContents(bodyEl);
      preRange.setEnd(range.startContainer, range.startOffset);
      touchStartIndex = preRange.toString().length;
    };

    // 터치 끝났을 때 선택된 텍스트 계산
    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const range = document.caretRangeFromPoint(touch.clientX, touch.clientY);
      if (!range) return;
      const preRange = range.cloneRange();
      preRange.selectNodeContents(bodyEl);
      preRange.setEnd(range.startContainer, range.startOffset);
      touchEndIndex = preRange.toString().length;

      const [start, end] = [
        Math.min(touchStartIndex, touchEndIndex),
        Math.max(touchStartIndex, touchEndIndex)
      ];
      const text = bodyEl.innerText.slice(start, end);

      // ✅ state 업데이트 (BottomBar 표시용)
      if (text && text.trim().length > 0) {
        setSelectedText(text.trim());
        setRange({ start, end });
      } else {
        setSelectedText("");
      }
    };

    bodyEl.addEventListener("touchstart", handleTouchStart);
    bodyEl.addEventListener("touchend", handleTouchEnd);

    return () => {
      bodyEl.removeEventListener("touchstart", handleTouchStart);
      bodyEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);



  return (
    <Wrapper>
      <TopMeta>
        <Category>{news.articleCategory}</Category>
        <PublishDate>{formatDate(news.publishDate)}</PublishDate>
      </TopMeta>

      <Divider />


      {/* // <b>, <i> 등 HTML 태그까지 그대로 보여주고 싶을 때 
        // <b>, <i> 등 HTML 태그까지 그대로 보여주고 싶을 때
        // JSX에서 직접 HTML을 렌더링하려면 dangerouslySetInnerHTML을 사용해야 함
      */}
      <Title dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(news.title) }} />


      <SubMeta>
        <Author>출처: {news.link ? <a href={news.link}>원문 링크</a> : "알 수 없음"}</Author>
        <View>view <strong>{news.viewCount}</strong></View>
      </SubMeta>


      {/* <Thumbnail /> */}


      <BodyText id="news-body">{renderWithHighlights(content)}</BodyText>

      <BottomBar
        articleId={news.id}
        selectedText={selectedText}
        onMemoClick={() => setShowModal(true)}
        onWordClick={() => setShowWordModal(true)}
      />


      {showModal && (
        <MemoModal
          memo={selectedMemo}
          articleId={news.id}
          onClose={handleModalClose}
          existingMemo={selectedMemo}
          range={range}
          setMemos={setMemos}
          selectedText={selectedText}
        />
      )}

      {showWordModal && (
        <WordModal
          onClose={() => setShowWordModal(false)}
          articleId={news.id}
          selectedText={selectedText}
        />
      )}
    </Wrapper>
  );
};

export default NewsDetailContent;

// 날짜 포맷 함수
function formatDate(dateInput) {
  if (!dateInput) return "";

  let date;

  // 배열 형태인 경우 [YYYY, MM, DD, hh?, mm?]
  if (Array.isArray(dateInput)) {
    const [year, month, day, hour = 0, minute = 0] = dateInput;
    date = new Date(year, month - 1, day, hour, minute);
  }
  // 문자열 형태인 경우 (기존 방식 유지)
  else {
    date = new Date(dateInput);
  }

  const days = ["일", "월", "화", "수", "목", "금", "토"];

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0부터 시작하니까 +1
  const day = date.getDate();
  const weekday = days[date.getDay()];

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}. ${month}. ${day}.(${weekday}) ${hours}:${minutes}`;
}

// HTML 엔티티(&quot;, &amp; 등)을 실제 문자로 복호화하는 함수
function decodeHtmlEntities(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

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

const PublishDate = styled.span`
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

  a {
    color: #8484ff;          /* 링크 색상 */
    margin-left: 4px;        /* '출처:'와 간격 */
    transition: color 0.2s ease;

    &:hover {
      text-decoration: underline; /* 호버 시 밑줄 표시 */
    }
  }
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

// 🟨 밑줄 + 형광펜 스타일의 mark
const HighlightMark = styled.mark`
  background: linear-gradient(to top, #cfbef4ff 45%, transparent 45%);
  text-underline-offset: 2px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(to top, #ecd878ff 45%, transparent 45%);
    text-decoration-color: #ffcd29;
  }

  ${({ focused }) =>
    focused &&
    `
    background: linear-gradient(to top, #ffea82ff 45%, transparent 45%) !important;
     text-underline-offset: 3px;
     transition: all 0.2s ease;
   `}
`;