import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../../../api/api"

const MemoModal = ({ articleId, selectedText, range, existingMemo, onClose, setMemos }) => {
  const [memo, setMemo] = useState(existingMemo || null);       // ← 서버에 존재하는 메모 (있으면 수정 모드)
  const [content, setContent] = useState(existingMemo?.content || ""); // ← textarea 내용
  const [isSaving, setIsSaving] = useState(false); // "지금 저장을 해야 함"을 알리는 '트리거' 상태
  const modalRef = useRef(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // 외부 클릭 → 닫기
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 입력 변경 시 호출: 내용 업데이트 + 저장 트리거 on
  const handleChange = (e) => {
    setContent(e.target.value);   // 입력값 반영
    setIsSaving(true);
  };


  //  자동 저장 로직 (최초 POST → 이후부터 PUT)
  useEffect(() => {
    if (!isSaving) return;

    // 디바운스 타이머: 입력이 멈춘 뒤 1초 지나면 저장 실행
    const timer = setTimeout(async () => {
      try {
        // (1) 최초 생성 (아직 memo.id 없음)
        if (!memo) {
          const res = await api.post(`/api/articles/${articleId}/memo`, {
            content,
            startIndex: range?.start,
            endIndex: range?.end,
          });
          console.log("새 메모 생성 성공:", res.data.response);
          setMemo(res.data.response); // 서버에 생성된 메모(아이디 등)를 상태에 저장 → 이후부터 수정 모드로 전환
          if (setMemos) {
            setMemos(prev => [...prev, res.data.response]);
          }
        }
        // (2) 수정 모드
        else {
          console.log("기존 메모 수정:", memo.id);
          await api.put(`/api/articles/${articleId}/memos/${memo.id}`, {
            content,
            startIndex: range?.start,
            endIndex: range?.end,
          });
          console.log("메모 자동 저장 성공 (수정)");
        }
      } catch (e) {
        // 6) 네트워크/인증 에러 등 저장 실패 처리
        console.error("자동 저장 실패:", e);
      } finally {
        // 7) 저장 시도(성공/실패 무관) 후에는 트리거를 꺼서 대기 상태로
        setIsSaving(false);
      }
    }, 1000);

    // 8) 다음 입력이 또 들어오면 이전 타이머 취소(디바운스 핵심)
    return () => clearTimeout(timer);

    // 9) content가 바뀌거나 isSaving이 켜질 때만 재실행
  }, [isSaving, content]);

  // 삭제 버튼 클릭 시
  const handleDelete = async () => {
    console.log("삭제할 메모:", memo);
    if (!memo) return;

    try {
      await api.delete(`/api/articles/${articleId}/memos/${memo.id}`);
      console.log("메모 삭제 성공");
      // 프론트 쪽 memos 배열에서도 즉시 제거
      if (setMemos) {
        setMemos(prev => prev.filter(m => m.id !== memo.id));
      }
      onClose(); // 닫기 (selectedMemo=null)
    } catch (err) {
      console.error("메모 삭제 실패:", err);
    }
  };

  return (
    <ModalWrapper ref={modalRef} className="memo-modal">
      <Header>
        <Title>메모</Title>
        <DeleteButton onClick={handleDelete}> 메모 삭제 </DeleteButton>
      </Header>
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder={
          existingMemo
            ? existingMemo.content
            : selectedText
              ? `“${selectedText}”에 대한 메모를 작성하세요`
              : "메모를 입력하세요"
        }
      />
      {isSaving && <SavingText>자동 저장 중...</SavingText>}
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
    background: #FFF;
    backdrop-filter: blur(1px);

    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 4000;
    padding: 11px;

`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

`;

const Title = styled.h3`   
    color: #666;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 0.24px;
    margin: 0
`;

const DeleteButton = styled.button`
    position: absolute;
    top: 9px;
    right: 9px;

    width: 50px;
    height: 14px;
    flex-shrink: 0;
    background: #D9D9D9;
 
    color: #000;
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0.16px;

    border: none;
    display: flex;

    justify-content: center;
    padding: 2px 6px;
    cursor: pointer;
  
`;

const Textarea = styled.textarea`
    flex: 1;

    color: #666;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0.2px;

    width: 100%;
    height: 120px;
    border: none;
    resize: none;
    outline: none;
`;

const SavingText = styled.span`
  align-self: flex-end;
  font-size: 8px;
  color: #999;
  margin-top: 4px;
`;