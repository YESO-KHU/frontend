import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/icons/search.svg';
import searchIcon2 from '../../assets/icons/searchMainColor.svg';

// bgColor prop을 통해 배경색을 조정할 수 있는 SearchBar 컴포넌트
// bgColor가 'transparent'일 경우 투명 배경과 아이콘 색상을 적용
const SearchBar = ({ bgColor, onSearch, initialValue = '' }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(initialValue);
  const searchIconSrc = bgColor === 'transparent' ? searchIcon2 : searchIcon;

  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  const handleClick = () => {
    if (bgColor !== 'transparent') {
      navigate('/news-list');
    }
  };

  const handleSearch = () => {
    if (bgColor === 'transparent' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && bgColor === 'transparent' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  // styled-components에서 $로 시작하는 prop은 자동으로 DOM에 전달되지 않도록 처리
  return (
    <SearchInputWrapper $bgColor={bgColor} onClick={handleClick}>
      <SearchField
        type="text"
        placeholder="✷ Search"
        $bgColor={bgColor}
        readOnly={bgColor !== 'transparent'}
        value={searchValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <SearchIcon
        src={searchIconSrc}
        alt="search"
        onClick={handleSearch}
        $clickable={bgColor === 'transparent'}
      />
    </SearchInputWrapper>
  );
};

export default SearchBar;

// bgColor props가 없을 경우 기본 theme 색상 사용
const SearchInputWrapper = styled.label`
  background-color: ${({ $bgColor, theme }) => $bgColor === 'transparent' ? 'transparent' : theme.mainLightTransparent};
  border: ${({ $bgColor, theme }) => $bgColor === 'transparent' ? `1px solid ${theme.mainLightTransparent}` : 'none'};
  border-radius: 40px;
  padding: 13px 20px;
  display: flex;
  align-items: center;
  height: 40px;
  gap: 8px;
`;

const SearchField = styled.input`
  background: transparent;
  border: none;
  outline: none;
  flex: 1;
  color: ${({ $bgColor, theme }) => $bgColor === 'transparent' ? theme.mainLightTransparent : 'white'};
  font-size: 12px;
  font-weight: 700;

  &::placeholder {
    color: ${({ $bgColor, theme }) => $bgColor === 'transparent' ? theme.mainLightTransparent : 'white'};
  }
`;

const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: ${({ $clickable }) => $clickable ? '0.7' : '1'};
  }
`;