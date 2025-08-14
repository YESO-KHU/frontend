import { useLocation } from "react-router-dom";
import styled from "styled-components";




const fallbackNews = {
  category: "경제",
  title: "금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목",
  content: `금융 이슈 관련 내용 금융 이슈 관련 내용 금융 이슈 관련 내용 제목금융 이슈 관련 내용 금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용금융 이슈 관련 내용 금융 이슈 관련 내용 금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 금융 이슈 관련 내용 금융 이슈 관련 내용 금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용금융 이슈 관련 내용 금융 이슈 관련 내용 금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용 제목금융 이슈 관련 내용`
};


const NewsDetailPage = () => {
  const location = useLocation();
  const news = location.state || fallbackNews;



  return (
    <Wrapper>

      <TopMeta>
        <Category>{news.category}</Category>
        <Date>2025. 7. 23.(수) 19:35</Date>
      </TopMeta>
      <Divider />


      <Title>{news.title}</Title>

      <SubMeta>
        <Author>무슨일보 / 누구누구 기자</Author>
        <View>view <strong>5,203</strong></View>
      </SubMeta>

      <Thumbnail />

      <BodyText>{news.content}</BodyText>

      <FixedButton>✶ AI 요약</FixedButton>
    </Wrapper>
  );
};

export default NewsDetailPage;


const Wrapper = styled.div`
  padding: 24px;
  padding-bottom: 100px;
`;

const TopMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Category = styled.span`
  font-size: 12px;
  font-style: semibold;
  color: ${({ theme }) => theme.gray};
`;

const Date = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.gray};
`;

const Title = styled.span`
  color: ${({ theme }) => theme.gray};
  font-size: 24px;
  font-weight: 600;
  font-style: SemiBold;
  margin-bottom: 32px;
  line-height: 1.4;
`;


const SubMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.gray};
  margin-bottom: 24px;
  margin-top: 8px;
`;

const Author = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.gray};
`;


const View = styled.span`
  strong {
    font-weight: 600;
  }
`;

const Thumbnail = styled.div`
  width: 340px;
  height: 168px;
  background-color: #D9D9D9;
  border-radius: 0px;
  margin: 0 auto 24px auto;
`;

const BodyText = styled.div`
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-line;
  color: ${({ theme }) => theme.gray};
`;

const FixedButton = styled.button`
  width: 80px;
  height: 40px;
  border-radius: 40px;
  border: none;
  color: white;
  font-size: 12px;
  font-weight: 700;
  font-style: Bold;
  background: linear-gradient(180deg, #8484FF 40%, #0606FA 100%);
  backdrop-filter: blur(2px);
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;


const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 16px 0;
`;