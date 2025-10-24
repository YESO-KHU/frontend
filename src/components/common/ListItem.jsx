import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ListItem = ({ category, title, preview, time, isLast = false, id, categoryVisible = true }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/news/${id}`);
    }
  };

  return (
    <Item isLast={isLast} onClick={handleClick}>
      {categoryVisible && <LeftLabel>{category}</LeftLabel>}
      <RightCol>
        {time && (
          <TitleRow>
            <ItemTitle>{title}</ItemTitle>
            <ItemTime>{time}</ItemTime>
          </TitleRow>
        )}
        {!time && <ItemTitle>{title}</ItemTitle>}
        <ItemPreview>{preview}</ItemPreview>
      </RightCol>
    </Item>
  );
};

export default ListItem;

const Item = styled.div`
  display: flex;
  padding: 16px 0px;
  color: #888;
  border-bottom: 0.1px solid #D9D9D9;
  cursor: pointer;
  ${({ isLast }) => isLast && `
    border-bottom: none;
  `}
`;

const LeftLabel = styled.div`
  display: flex;
  font-size: 12px;
  white-space: nowrap;
  width: 40px;
  flex-shrink: 0;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  gap: 8px;
`;

const ItemTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #888;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemPreview = styled.p`
  margin-top: 4px;
  font-size: 12px;
  line-height: normal;
  color: #888;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
`;

const ItemTime = styled.p`
  font-size: 10px;
  line-height: normal;
  color: #9aa0a6;
  margin-bottom: 2px;
  white-space: nowrap;
  flex-shrink: 0;
`;

