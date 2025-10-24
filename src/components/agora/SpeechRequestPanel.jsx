import React from 'react';
import styled from 'styled-components';
import handIcon from '../../assets/icons/hand.svg';
import { useAgoraStatus } from '../../contexts/AgoraStatusContext';

const SpeechRequestPanel = () => {
    const { isConnected, requestSpeech, cancelSpeech } = useAgoraStatus();
    const [isRequested, setIsRequested] = React.useState(false);

    const handleRequestSpeech = () => {
        if (isConnected && !isRequested) {
            requestSpeech();
            setIsRequested(true);
        }
    };

    const handleCancelSpeech = () => {
        if (isConnected && isRequested) {
            cancelSpeech();
            setIsRequested(false);
        }
    };

    if (!isConnected) {
        return null;
    }

    return (
        <SpeechPanel>
            <SpeechButton
                variant={isRequested ? "active" : "default"}
                onClick={isRequested ? handleCancelSpeech : handleRequestSpeech}
            >
                <IconWrapper>
                    <img src={handIcon} alt="hand icon" />
                </IconWrapper>
                <ButtonText>
                    {isRequested ? '발언권 취소' : '발언권 요청'}
                </ButtonText>
            </SpeechButton>

            {isRequested && (
                <StatusText>
                    발언권 요청 중... 순서를 기다려주세요.
                </StatusText>
            )}
        </SpeechPanel>
    );
};

export default SpeechRequestPanel;

const SpeechPanel = styled.div`
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 400px;
    z-index: 100;
`;

const SpeechButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    ${({ variant, theme }) => {
        switch (variant) {
            case "active":
                return `
                    background: #ff4757;
                    color: #fff;
                    &:hover {
                        background: #ff3742;
                    }
                `;
            case "default":
                return `
                    background: ${theme.mainLight};
                    color: #fff;
                    &:hover {
                        background: #7a5df0;
                    }
                `;
        }
    }}
`;

const IconWrapper = styled.div`
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ButtonText = styled.span`
    font-size: 14px;
    font-weight: 600;
`;

const StatusText = styled.div`
    text-align: center;
    font-size: 12px;
    color: #666;
    margin-top: 8px;
    padding: 8px;
    background: rgba(255, 71, 87, 0.1);
    border-radius: 8px;
`;
