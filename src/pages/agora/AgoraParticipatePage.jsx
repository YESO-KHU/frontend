import styled from 'styled-components';
import Header from '../../components/common/Header';
import back from "../../assets/icons/back.png";
import profileIcon from "../../assets/icons/profile.png";
import RedDot from "../../assets/icons/status_red.png";
import GreenDot from "../../assets/icons/status_green.png";



const AgoraParticipatePage = () => {
  const agoraList = [
    { id: 1, title: 'oo 법안에 대한 찬/반 토론', desc: '설명: oo 법안에 대한 찬,반 토론을 주최하려고 합니다. 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 ...', members: '2 / 4 명', type: '찬/반', status: '대기중' },
    { id: 2, title: 'oo 법안에 대한 찬/반 토론', desc: '설명: oo 법안에 대한 찬,반 토론을 주최하려고 합니다. 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 ...', members: '1 / 4 명', type: '자유', status: '대기중' },
    { id: 3, title: 'oo 법안에 대한 찬/반 토론', desc: '설명: oo 법안에 대한 찬,반 토론을 주최하려고 합니다. 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 ...', members: '2 / 4 명', type: '찬/반', status: '진행중' },
  ];

  return (
    <PageContainer>
      <HeaderContainer>
        <BackIcon src={back} alt="뒤로가기" />
        <Title>아고라 참여하기</Title>
      </HeaderContainer>

      <CardContainer>
        {agoraList.map((item) => (
          <Card key={item.id}>
            <StatusTag status={item.status}>
              <img
                src={item.status === '진행중' ? RedDot : GreenDot}
                alt={item.status}
              />
              {item.status}
            </StatusTag>
            <CardTitle>주제: {item.title}</CardTitle>
            <CardDesc>{item.desc}</CardDesc>
            <InfoRow>
              <MemberInfo>
                <ProfileImg src = {profileIcon} alt="참여자 프로필" />
                <MemberText>{item.members}</MemberText>
              </MemberInfo>

               <Divider>|</Divider>
            
              <TypeTag>{item.type}</TypeTag>
            </InfoRow>
          </Card>
        ))}
      </CardContainer>
    </PageContainer>
  );
};

export default AgoraParticipatePage;




const PageContainer = styled.div`
  min-height: 100vh;
  padding: 0 26px 42px;
  background-color: #fff;
`;

const HeaderContainer = styled.header`
  position: relative;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 32px 0 24px;
  margin-bottom: 34px;
`;

const BackIcon = styled.img`
  position: absolute;
  left: 36px;
  width: 6px;
  height: 10px;
  flex-shrink: 0;
`;

const Title = styled.h1`
  background: linear-gradient(180deg, rgba(6, 6, 250, 0.60) 27.08%, rgba(132, 132, 255, 0.24) 143.75%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-align: center;
  font-family: ABeeZee;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.3px;

  margin: 0;
`;


const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 0 27px;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 110px;
  flex-shrink: 0;

  border-radius: 22px;
  background: #FFF;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.10);


  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 7px;

`;

const CardTitle = styled.h2`
  color: #888;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.24px;

  margin: 0;
`;

const CardDesc = styled.p`
  color: #888;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.24px;

  margin: 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ProfileImg = styled.img`
  width: 12px;
  height: 12px;
  flex-shrink: 0;

  fill: #D9D9D9;
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


const MemberText = styled.span`
  color: #888;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.24px;
`;

const TypeTag = styled.span`
  border-radius: 5px;
  background: #D9D9D9;
  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  padding: 2px 6px;

  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  letter-spacing: 0.2px;
`;

const StatusTag = styled.span`
  position: absolute;
  top: 18px;
  right: 15px;

  display: flex;
  align-items: center;
  gap: 3px;


  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  letter-spacing: 0.2px;

  color: ${({ status }) => (status === '진행중' ? '#FF4B4B' : '#00A651')};

  img {
    width: 6px;
    height: 6px;
    flex-shrink: 0;
  }
`;

