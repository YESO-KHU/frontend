import styled from 'styled-components';
import { useEffect, useState } from 'react';
import AiButton from "./AiButton";
import memoIcon from "../../../assets/icons/memo.png";
import wordIcon from "../../../assets/icons/word.png";
import MemoModal from "./MemoModal";
import WordModal from "./WordModal";




const BottomBar = ({ articleId }) => {
  const [showSelectionBar, setShowSelectionBar] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [showWord, setShowWord] = useState(false); 
  const [selectedText, setSelectedText] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  useEffect(() => {
    console.log("👀 useEffect 실행됨 (mouseup 리스너 등록)");

    const articleBody = document.querySelector(".article-body");
    if (!articleBody) return;

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (!selection || !text) return;
    if (showMemo || showWord) return;

    const articleBody = document.querySelector(".article-body");
    if (!articleBody) return;

    const range = selection.getRangeAt(0);
    const preRange = range.cloneRange();

    // articleBody 전체 기준으로 offset 계산
    preRange.selectNodeContents(articleBody);
    preRange.setEnd(range.startContainer, range.startOffset);

    const start = preRange.toString().length;
    const end = start + text.length;

    if (start >= 0) {
      setShowMemo(false);
      setTimeout(() => {
        setSelectedText(text);
        setStartIndex(start);
        setEndIndex(end);
        setShowSelectionBar(true);
      }, 50);
    }

    console.log("📍 인덱스:", start, end, " | 선택된 텍스트:", text);
};

    
    articleBody.addEventListener("mouseup", handleMouseUp);
    return () => {
      articleBody.removeEventListener("mouseup", handleMouseUp);
    };
  }, [showMemo, showWord]);


  const closeAll = () => {
    setShowMemo(false);
    setShowWord(false);
    setShowSelectionBar(false);
    window.getSelection().removeAllRanges();
  };

  return (
    <>
      {showSelectionBar ? (
        <BarContainer>
            <ActionButton onClick = {() => setShowMemo(true)}>
              <Side> 
                <Icon src = {memoIcon} alt = "메모" />
                <Label> 메모 </Label>
              </Side>
            </ActionButton>

          <Divider> | </Divider>

          <ActionButton onClick={() => setShowWord(true)}>
            <Side>
              <Icon src = {wordIcon} alt = "용어" />
              <Label> 용어 </Label>
            </Side>
          </ActionButton>
        
        </BarContainer>
      ) : (
        <AiButton />  
      )}

      {showMemo && (
        <MemoModal
          onClose={closeAll}
          articleId={articleId}
          selectedText={selectedText}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      )}
      {showWord && (
        <WordModal
          onClose={closeAll}
          articleId={articleId}
        />
      )}

    </>
  );
};

export default BottomBar;  


const BarContainer = styled.div`
    position: fixed;
    width: 340px;
    height: 40px;
    flex-shrink: 0;

    left: 50%;
    bottom: 40px;
    transform: translateX(-50%);

    border-radius: 40px;
    background: #FFF;
    backdrop-filter: blur(1px);

    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    
    display: flex;
    align-items: center;

    z-index: 3000;

`;

const ActionButton = styled.button`
    color: #8484FF;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 0.24px;
    background: ${props => props.highlighted ? '#8484FF' : 'transparent'};
    border: none;

    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center; 
`;

const Side = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.img`
  width: 14px;
  height: 14px;
  flex-shrink: 0;

  fill: #FFF;
  stroke-width: 1px;
  stroke: #8484FF;

`;

const Label = styled.span`

  color: ${props => {
    return props.highlighted ? '#FFFFFF' : '#8484FF';
  }};

  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.24px;
  margin-left: 8px;
`;

const Divider = styled.div`
  color: #8484FF;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 200;
  line-height: 1;
  letter-spacing: 0.24px;
`;