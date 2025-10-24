import styled from 'styled-components';
import { useEffect, useState } from 'react';
import AiButton from "./AiButton";
import memoIcon from "../../../assets/icons/memo.png";
import wordIcon from "../../../assets/icons/word.png";
import MemoModal from "./MemoModal";
import WordModal from "./WordModal";



const BottomBar = ({ articleId, selectedText, onMemoClick, onWordClick }) => {
  const [showSelectionBar, setShowSelectionBar] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [showWord, setShowWord] = useState(false);

  useEffect(() => {
    if (selectedText && selectedText.trim().length > 0) {
      setShowSelectionBar(true);
    } else {
      setShowSelectionBar(false);
    }
  }, [selectedText]);

  return (
    <>
      {showSelectionBar ? (
        <BarContainer>
          <ActionButton onClick={onMemoClick}>
            <Side>
              <Icon src={memoIcon} alt="메모" />
              <Label> 메모 </Label>
            </Side>
          </ActionButton>

          <Divider> | </Divider>

          <ActionButton onClick={onWordClick}>
            <Side>
              <Icon src={wordIcon} alt="용어" />
              <Label> 용어 </Label>
            </Side>
          </ActionButton>

        </BarContainer>
      ) : (
        <AiButton />
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
    cursor: pointer;
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