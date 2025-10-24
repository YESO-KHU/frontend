import styled from 'styled-components';
import back from '../../assets/icons/back.png';
import { useNavigate } from 'react-router-dom';

const Header = ({ content, onClick }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <HeaderContainer>
      {onClick && (
        <BackIcon src={back} alt="back" onClick={handleBackClick} />
      )}
      <Title isKorean={/^[가-힣]/.test(content)}>{content}</Title>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 10px;
  padding-bottom: 24px;
`;

const BackIcon = styled.img`
  position: absolute;
  left: 16px;
  width: 6px;
  height: 10px;
  flex-shrink: 0;
  cursor: pointer;
`;

const Title = styled.h1`
  background: linear-gradient(
    180deg,
    rgba(6, 6, 250, 0.6) 27.08%,
    rgba(132, 132, 255, 0.24) 143.75%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-family: ${({ isKorean }) => (isKorean ? "'ABeeZee'" : "'godoRoundedR'")};
  font-weight: 400;
  font-size: 28px;
  font-size: ${({ isKorean }) => (isKorean ? '15px' : '28px')};
  text-transform: lowercase;
  letter-spacing: 0.02em;
  margin: 0;
`;