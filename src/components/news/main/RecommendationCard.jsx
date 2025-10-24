import styled from 'styled-components';
import ecoIcon from '../../../assets/icons/my/eco.svg';
import politicIcon from '../../../assets/icons/my/politic.svg';
import societyIcon from '../../../assets/icons/my/society.svg';
import cultureIcon from '../../../assets/icons/my/culture.svg';
import itIcon from '../../../assets/icons/my/it.svg';
import globalIcon from '../../../assets/icons/my/global.svg';

const RecommendationCard = ({ userStats }) => {
  // 가장 높은 관심도를 가진 분야의 아이콘 반환
  const getTopInterestIcon = () => {
    if (!userStats) return politicIcon;

    const categoryMapping = {
      'ECONOMY': ecoIcon,
      'POLITICS': politicIcon,
      'SOCIETY': societyIcon,
      'CULTURE': cultureIcon,
      'IT': itIcon,
      'GLOBAL': globalIcon,
    };

    // 가장 높은 관심도를 가진 분야 찾기
    const categories = [
      { name: 'ECONOMY', count: userStats.economy_score || 0 },
      { name: 'POLITICS', count: userStats.politics_score || 0 },
      { name: 'SOCIETY', count: userStats.society_score || 0 },
      { name: 'CULTURE', count: userStats.culture_score || 0 },
      { name: 'IT', count: userStats.it_score || 0 },
      { name: 'GLOBAL', count: userStats.global_score || 0 },
      { name: 'ETC', count: userStats.etc_score || 0 },
    ];

    const topCategory = categories.reduce((max, current) =>
      current.count > max.count ? current : max
    );

    // ETC가 가장 높으면 기본값으로 정치 아이콘 반환
    if (topCategory.name === 'ETC') {
      return politicIcon;
    }

    return categoryMapping[topCategory.name] || politicIcon;
  };

  return (
    <CardContainer src={getTopInterestIcon()} alt="관심분야 아이콘" />
  );
};

export default RecommendationCard;

const CardContainer = styled.img`
  width: 50%;
  object-fit: contain;
  border-radius: 22px;
`;
