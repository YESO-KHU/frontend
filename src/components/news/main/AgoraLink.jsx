import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import agora from "../../../assets/img/agora.png"

const AgoraLink = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/agora/detail');
  };

  return (
    <AgoraButton onClick={handleClick}>
      <BackgroundImage src={agora} />
      <TextArea>
        <LeftContent>
          <IconGlow>🔥</IconGlow>
          <AgoraText>화제의 아고라 보러가기</AgoraText>
        </LeftContent>
        <ArrowIcon>→</ArrowIcon>
      </TextArea>
    </AgoraButton>
  );
};

export default AgoraLink;

// ✅ 스타일링 부분
const AgoraButton = styled.div`
  border-radius: 22px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0px 1px 10px 0px #0000001A;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(111, 115, 255, 0.25);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const TextArea = styled.div`
  background: white;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconGlow = styled.div`
  font-size: 16px;
  animation: flicker 1.6s infinite ease-in-out;

  @keyframes flicker {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
`;

const AgoraText = styled.span`
  color: #888;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
`;

const ArrowIcon = styled.span`
  font-size: 18px;
  color: #888;
  transition: transform 0.3s ease;

  ${AgoraButton}:hover & {
    transform: translateX(4px);
  }
`;