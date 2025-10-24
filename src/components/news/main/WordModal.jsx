import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import api from "../../../api/api";



const WordModal = ({ onClose, articleId = 1 }) => {
  const [selectedWord, setSelectedWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const modalRef = useRef(null);


useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
      };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, [onClose]);

useEffect(() => {
  const sel = window.getSelection();
  let text = sel?.toString().trim() || "";

  if (!text){
    return;
  }
  text = text.replace(/\s+/g, " ").trim();
  
  if (text.length > 30) text = text.split(" ")[0];
  setSelectedWord(text);
  }, []);

  useEffect(() => {
    const fetchMeaning = async () => {
      if (!selectedWord){
        return;
      }
      setLoading(true);
      setError('');
      try{
        const res = await api.get(`/api/articles/${articleId}/word/search`, {
          params: {
            query: selectedWord,
        },  
});

        const data = res.data?.response;
        if (!data){
          setMeaning("");
          setExample("");
          setError("뜻을 찾지 못했어요.");
          return;
        }

        setMeaning(data.description || "");
        setExample(data.example || "");
      } catch(e){
        setError("네트워크 오류로 조회 실패.");
      } finally{
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
              <Meaning>{meaning || "뜻 정보가 없습니다."}</Meaning>
              {example && <Example>{example}</Example>}
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

const Example = styled.p`
    color: #666;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: 160%;
    letter-spacing: 0.2px;
    margin: 0;
`;


