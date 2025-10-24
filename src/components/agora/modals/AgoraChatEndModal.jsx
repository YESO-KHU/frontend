import styled from "styled-components";
import BaseModal from '../../common/BaseModal';
import ModalButton from "../../common/ModalButton";
import AgoraChatModalBase from "./AgoraChatModalBase";

const AgoraChatEndModal = ({ isOpen, onClose, reportData }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <AgoraChatModalBase
                title="토론 종료"
                description="토론이 종료되었습니다. 수고하셨습니다!"
            >
                {reportData && (
                    <ReportContainer>
                        {/* AI 요약 */}
                        <ReportSection>
                            <ReportTitle>AI 요약</ReportTitle>
                            <ReportContent>
                                {reportData.summary?.aiSummary || reportData.results?.aiSummary || '요약 정보가 없습니다.'}
                            </ReportContent>
                        </ReportSection>

                        {/* 결론 */}
                        <ReportSection>
                            <ReportTitle>결론</ReportTitle>
                            <ReportContent>
                                {reportData.summary?.conclusion || reportData.results?.conclusion || '결론 정보가 없습니다.'}
                            </ReportContent>
                        </ReportSection>
                    </ReportContainer>
                )}
            </AgoraChatModalBase>
            <ButtonContainer>
                <LeaveButton onClick={onClose}>나가기</LeaveButton>
            </ButtonContainer>
        </BaseModal>
    )
}

export default AgoraChatEndModal;

const LeaveButton = styled.button`
    width: 100%;
    padding: 8px 28px;
    cursor: pointer;
    background: rgba(132, 132, 255, 0.8);
    color: #fff;
    border: none;
    border-radius: 12px;
    height: 34px;
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 16px;
    justify-content: space-between;
`;

const ReportContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 300px;
    overflow-y: auto;
    margin-top: 16px;
`;

const ReportSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ReportTitle = styled.div`
    font-size: 14px;
    margin-left: 8px;
    font-weight: 600;
    color: #333;
    text-align: left;
`;

const ReportContent = styled.div`
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    background: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    text-align: left;
`;

const KeyPointsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const KeyPointItem = styled.div`
    font-size: 13px;
    color: #666;
    line-height: 1.4;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 6px;
`;