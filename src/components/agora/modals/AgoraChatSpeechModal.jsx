import React from "react";
import styled from "styled-components";
import BaseModal from "../../common/BaseModal";
import ModalButton from "../../common/ModalButton";
import AgoraChatModalBase from "./AgoraChatModalBase";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";

const AgoraChatSpeechModal = ({ isOpen, onClose }) => {
    const { agoraId } = useParams();
    const [inputValue, setInputValue] = useState("");
    const [timeElapsed, setTimeElapsed] = useState(0); // 경과 시간 (0부터 시작)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerRef = useRef(null);

    // 제출 핸들러
    const handleSubmit = useCallback(async () => {
        if (inputValue.trim() === "" || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await api.post(`/api/agoras/${agoraId}/speech`, {
                agoraId: parseInt(agoraId),
                type: "OPENING",
                content: inputValue.trim()
            });

            console.log('발언 제출 성공:', response.data);
            onClose();
        } catch (error) {
            console.error('발언 제출 실패:', error);
            alert('발언 제출에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    }, [inputValue, isSubmitting, agoraId, onClose]);

    // 제출 핸들러를 ref로 저장
    const handleSubmitRef = useRef(handleSubmit);
    handleSubmitRef.current = handleSubmit;

    // 타이머 시작
    useEffect(() => {
        if (isOpen) {
            setTimeElapsed(0);
            setInputValue("");
            setIsSubmitting(false);

            timerRef.current = setInterval(() => {
                setTimeElapsed((prev) => {
                    if (prev >= 89) { // 90초(1분 30초)에 도달하면 자동 제출
                        handleSubmitRef.current();
                        return 90;
                    }
                    return prev + 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isOpen]);

    // 시간 포맷팅
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <AgoraChatModalBase
                title="입장 발언"
                description="*1분 30초 동안 찬성 측 발언을 정리해 입력해주세요."
            >
                <InputBox
                    placeholder="입장 발언 내용을 입력해주세요."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isSubmitting}
                />
                <TimeInfo>
                    <span className="current">{formatTime(timeElapsed)}</span>
                    /
                    <span className="total">01:30</span>
                </TimeInfo>

            </AgoraChatModalBase>

            <ModalButton
                variant="primary"
                onClick={handleSubmit}
                disabled={inputValue.trim() === "" || isSubmitting || timeElapsed >= 90}>
                {isSubmitting ? "제출 중..." : "제출하기"}
            </ModalButton>
        </BaseModal>
    )
}

export default AgoraChatSpeechModal;


const InputBox = styled.textarea`
    font-size: 12px;
    font-weight: 300;
    background: #F4F4F4;
    padding: 12px;
    border-radius: 5px;
    border: none;
    width: 100%;
    min-height: 170px;
    text-align: left;
    resize: none; /* 크기 조절 비활성화 */
    margin-bottom: 8px;

    &::placeholder {
        font-size: 12px;
        color: ${({ theme }) => theme.gray};
    }

    &:focus {
    outline: none; /* 기본 파란 외곽선 제거 */
    border: 0.4px solid ${({ theme }) => theme.mainLight}; /* 원하는 색상 */
    }
`;

const TimeInfo = styled.div`
  font-size: 12px;
  font-weight: 500;
  width: 100%;
  padding: 0 16px;
  letter-spacing: 0.02em;
  color: #A2A2A2; /* 회색 */

  .current {
    color: #A2A2A2; /* 회색 */
    margin-right: 4px;
  }

  .total {
    color: #444; /* 검정 */
    margin-left: 4px;
  }
`;
