import styled from "styled-components";
import { useState, useEffect } from "react";
import api from "../../../api/api";

const MemoModal = ({ onClose, articleId, selectedText, startIndex, endIndex, memo }) => { 
  const [content, setContent] = useState(
    "작성작성작성하기...\n클릭하면 편집할 수 있게끔하면 좋겠어요\n클릭하면 편집할 수 있게끔하면 좋겠어요\n클릭하면 편집할 수 있게끔하면 좋겠어요"
  )
  const [initialContent, setInitialContent] = useState(content);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setIsEdited(content.trim() !== initialContent.trim());
  }, [content, initialContent]);

  const handleSave = async () => {
    console.log("handleSave 실행됨");
    console.log("📍 인덱스:", startIndex, endIndex);
    try {
      const response =  await api.post(`/api/articles/${articleId}/memo`,
          {
            content,
            startIndex,
            endIndex,
          });

      console.log("메모 저장 성공");
      alert("메모가 저장되었습니다!");
      setInitialContent(content);
    } catch (err) {
      console.error("❌ 메모 저장 실패:", err.response?.status, err.response?.data);
      alert("메모 저장에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!memo?.id) {
      alert("삭제할 메모가 없습니다.");
      return;
    }

    try {
      const res = await api.delete(`/api/articles/${articleId}/memos/${memo.id}?user=${query}`
      );

      console.log("🗑️ 메모 삭제 성공:", res.data);
      alert("메모가 삭제되었습니다.");
      onClose(true); 
    } catch (err) {
      console.error("❌ 메모 삭제 실패:", err.response?.status, err.response?.data);
      alert("메모 삭제에 실패했습니다.");
    }
  };



  return (
    <ModalWrapper>
      <Header>
        <Title> 메모 </Title>
        {isEdited ? (
          <SaveButton onClick={handleSave}> 저장 </SaveButton>
        ) : (
          <DeleteButton onClick={handleDelete}> 삭제 </DeleteButton>
        )}
      </Header>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="메모를 입력하세요..."
      />
    </ModalWrapper>
  );
};

export default MemoModal;

const ModalWrapper = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);

  width: 340px;
  height: 90px;
  flex-shrink: 0;

  border-radius: 8px;
  background: #fff;
  backdrop-filter: blur(1px);

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 4000;
  padding: 11px;
`;

const Header = styled.div`
  position: relative;
  width: 100%;
  display: flex;

  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  color: #666;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 700;
  margin: 0;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 9px;
  right: 9px;

  width: 24px;
  height: 14px;
  border-radius: 4px;
  background: #8484ff;

  color: #fff;
  font-family: Pretendard;
  font-size: 8px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.16px;

  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
`;

const SaveButton = styled.button`
  position: absolute;
  top: 9px;
  right: 9px;

  width: 24px;
  height: 14px;
  border-radius: 4px;
  background: #8484ff;

  color: #fff;
  font-family: Pretendard;
  font-size: 8px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.16px;

  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;

`;


const Textarea = styled.textarea`
  flex: 1;
  color: #666;
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 300;

  width: 100%;
  height: 120px;
  border: none;
  resize: none;
  outline: none;
`;