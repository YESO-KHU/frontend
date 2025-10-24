import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import api from '../../../api/api';

const WordModal = ({ onClose, articleId, selectedText }) => {
  const [selectedWord, setSelectedWord] = useState(selectedText || "");
  const [meaning, setMeaning] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(" ");

  const modalRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!selectedText) return;
    let text = selectedText.trim().replace(/\s+/g, " ");
    if (text.length > 30) text = text.split(" ")[0];
    setSelectedWord(text);
  }, [selectedText]);

  useEffect(() => {
    const fetchMeaning = async () => {
      if (!selectedWord) {
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/api/articles/${articleId}/word/search`, {
          params: {
            query: selectedWord,
          },
        });

        console.log("용어 뜻 조회 성공:", res.data.response);

        const data = res.data?.response;
        if (!data) {
          setMeaning("");
          setError("뜻을 찾지 못했어요.");
          return;
        }

        // _empty_ 값은 null로 처리
        const desc = data.description?.trim();
        setMeaning(!desc || desc.toLowerCase() === "_empty_" ? null : desc);
      } catch (e) {
        setError("네트워크 오류로 조회 실패.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeaning();
  }, [selectedWord, articleId]);



  return (
    <ModalWrapper ref={modalRef}>
      <Header>
        <Title> {selectedWord || "용어"} </Title>
      </Header>
      <ContentBox>
        {loading && <Meaning> 불러오는 중... </Meaning>}
        {!loading && error && <Meaning>{error}</Meaning>}
        {!loading && !error && (
          <>
            {meaning ? (
              <Meaning
                dangerouslySetInnerHTML={{ __html: meaning }}
              />
            ) : (
              <Meaning>뜻 정보가 없습니다.</Meaning>
            )}
          </>
        )}
      </ContentBox>
    </ModalWrapper>
  );
};

export default WordModal;

const ModalWrapper = styled.div`
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);

    width: 340px;
    height: 90px;
    flex-shrink: 0;

    border-radius: 8px;
    background: #FFF;
    backdrop-filter: blur(1px);

    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    z-index: 4000;
    padding: 16px;

`;

const Header = styled.div`
  margin-bottom: 12px;
`;

const Title = styled.h3`   
    color: #8686FF;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 0.24px;
    margin: 0
`;

const ContentBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Meaning = styled.p`
    color: #666;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    line-height: 160%; /* 16px */
    letter-spacing: 0.2px;
    margin: 0;
`;


