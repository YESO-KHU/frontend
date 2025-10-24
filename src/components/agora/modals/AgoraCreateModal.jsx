import styled from 'styled-components';
import BaseModal from '../../common/BaseModal';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModalButton from '../../common/ModalButton';
import api from '../../../api/api';

const AgoraCreateModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [selectedNewsId, setSelectedNewsId] = useState(null);
    const [selectedNewsTitle, setSelectedNewsTitle] = useState(null);
    const [scrapList, setScrapList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSelectNews = (newsId, newsTitle) => {
        setSelectedNewsId(newsId);
        setSelectedNewsTitle(newsTitle);
    }

    const handleNavigate = () => {
        if (selectedNewsId) {
            navigate("/agora/create", {
                state: { newsId: selectedNewsId, newsTitle: selectedNewsTitle }, // 페이지 이동 시 state로 전달
            });
        }
    };

    const getScraps = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/scraps`);
            if (res.data.isSuccess) {
                console.log(res.data.response.scrapList);
                setScrapList(res.data.response.scrapList);
            }
        } catch (error) {
            console.error('스크랩 목록 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            getScraps();
        }
    }, [isOpen]);

    const formatDate = (publishDate) => {
        if (!publishDate || publishDate.length < 5) return '';
        const [year, month, day, hour, minute] = publishDate;
        return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <AgoraCreateModalContainer>
                <Title>스크랩한 기사</Title>
                <ScrapListContainer>
                    {loading ? (
                        <LoadingText>로딩 중...</LoadingText>
                    ) : scrapList.length === 0 ? (
                        <EmptyText>스크랩한 기사가 없습니다.</EmptyText>
                    ) : (
                        scrapList.map((scrap) => (
                            <ScrapItem
                                key={scrap.id}
                                onClick={() => handleSelectNews(scrap.id, scrap.title)}
                                isSelected={selectedNewsId === scrap.id}
                            >
                                <ScrapTitle dangerouslySetInnerHTML={{ __html: scrap.title }} />
                                <ScrapDate>{formatDate(scrap.publishDate)}</ScrapDate>
                            </ScrapItem>
                        ))
                    )}
                </ScrapListContainer>
                <ButtonContainer>
                    <ModalButton variant="primary"
                        onClick={handleNavigate} // 선택된 뉴스 아이디로 네비게이트
                        disabled={!selectedNewsId} // selectedNewsId가 null이면 선택버튼 비활성화
                    >선택</ModalButton>
                    <ModalButton variant="secondary" onClick={onClose}>닫기</ModalButton>
                </ButtonContainer>
            </AgoraCreateModalContainer>

        </BaseModal>
    )
}
export default AgoraCreateModal;

const AgoraCreateModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
`;

const Title = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.gray};
`;

const ScrapListContainer = styled.div`
    height: 260px;
    overflow-y: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    
`;

const ScrapItem = styled.div`
    padding: 15px 10px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    background-color: ${({ isSelected }) => isSelected ? '#f4f4f4' : 'white'};
`;

const ScrapTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.gray};
    margin-bottom: 4px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const ScrapDate = styled.div`
    font-size: 12px;
    color: #999;
`;

const LoadingText = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.gray};
    font-size: 14px;
    padding: 20px;
`;

const EmptyText = styled.div`
    text-align: center;
    color: #999;
    font-size: 14px;
    padding: 20px;
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 16px;
    justify-content: space-between;
`;
