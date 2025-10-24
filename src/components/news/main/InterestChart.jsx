import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { theme } from '../../../styles/theme';
import styled from 'styled-components';

// Chart.js에 필요한 요소 등록
Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    r: {
      angleLines: { display: false },
      grid: {
        color: ['#BFBFBF', '#E0E0E0', '#E0E0E0', '#E0E0E0', '#E0E0E0'], // 바깥쪽부터 안쪽 순서
        lineWidth: [0.4, 0.2, 0.2, 0.2, 0.2], // 바깥쪽부터 안쪽 순서
      },
      pointLabels: {
        color: '#888888',
        font: { size: 6, weight: 500 },
      },
      min: 0,
      max: 100,
      ticks: {
        display: false,
        stepSize: 20,
      },
    },
  },
  animation: {
    duration: 900,
  },
};

const InterestChartChartJS = ({ userStats }) => {
  // 기본 데이터 (로딩 중이거나 데이터가 없을 때)
  const defaultData = [0, 0, 0, 0, 0, 0];
  const defaultLabels = ['정치', '경제', '사회', '문화', 'IT/과학', '글로벌'];

  // 사용자 통계 데이터가 있을 때
  const rawData = userStats ? [
    userStats.politics_score || 0,
    userStats.economy_score || 0,
    userStats.society_score || 0,
    userStats.culture_score || 0,
    userStats.it_score || 0,
    userStats.global_score || 0
  ] : defaultData;

  // 최대값을 찾아서 비례적으로 변환 (0-100 스케일)
  const maxValue = Math.max(...rawData, 1); // 최소 1로 설정하여 0으로 나누기 방지
  const chartData = rawData.map(value => (value / maxValue) * 100);

  console.log('userStats:', userStats);
  console.log('rawData:', rawData);
  console.log('maxValue:', maxValue);
  console.log('chartData:', chartData);
  console.log('defaultLabels:', defaultLabels);

  const data = {
    labels: defaultLabels,
    datasets: [
      {
        label: '관심도',
        data: chartData,
        backgroundColor: 'rgba(6, 6, 250, 0.13)',
        borderColor: '#0606FA',
        pointBackgroundColor: '#0606FA',
        borderWidth: 0.5,
        pointRadius: 0.8,
        pointHoverRadius: 2,
      },
    ],
  };

  return (
    <ChartCard>
      <ChartTitle>분야별 관심도</ChartTitle>
      <ChartContainer>
        <Radar data={data} options={options} />
      </ChartContainer>
    </ChartCard>
  );
};

export default InterestChartChartJS;

const ChartCard = styled.div`
  background: white;
  border-radius: 22px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 50%;
  aspect-ratio: 1 / 1; /* 가로:세로 비율을 1:1로 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 10px 0px 10px;
  overflow: hidden;
`;

const ChartTitle = styled.h3`
  color: ${theme.gray};
  font-size: 10px;
  font-weight: 700;
  text-align: center;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;