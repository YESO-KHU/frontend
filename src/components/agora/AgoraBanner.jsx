import styled from "styled-components";
import userProfileIcon from '../../assets/icons/userProfile.svg';
import api from "../../api/api";
import { useState, useEffect, useRef } from 'react';
import AgoraStartModal from "./modals/AgoraStartModal";

const AgoraBanner = () => {
    const [popularAgoras, setPopularAgoras] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [selectedAgora, setSelectedAgora] = useState(null);
    const slideRef = useRef(null);

    const getPopularAgoras = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/agoras/popular?limit=5');
            setPopularAgoras(res.data.response);
        } catch (error) {
            console.error('인기 아고라 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPopularAgoras();
    }, []);

    // 무한 슬라이드 (한 방향)
    useEffect(() => {
        if (popularAgoras.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
            setIsTransitioning(true);
        }, 3000);

        return () => clearInterval(interval);
    }, [popularAgoras.length]);

    // 슬라이드 끝에서 리셋 처리
    useEffect(() => {
        if (popularAgoras.length === 0) return;
        const handleTransitionEnd = () => {
            if (currentIndex === popularAgoras.length) {
                // 복제 슬라이드에서 첫 번째로 순간 이동
                setIsTransitioning(false);
                setCurrentIndex(0);
            }
        };

        const slideEl = slideRef.current;
        slideEl?.addEventListener("transitionend", handleTransitionEnd);
        return () => slideEl?.removeEventListener("transitionend", handleTransitionEnd);
    }, [currentIndex, popularAgoras.length]);

    const getStatusText = (status) => {
        return status === 'WAITING' ? '참여 가능 / 관전 가능' : '관전 가능';
    };

    if (loading) {
        return <AgoraBannerContainer><AgoraBannerText>로딩 중...</AgoraBannerText></AgoraBannerContainer>;
    }

    if (popularAgoras.length === 0) {
        return <AgoraBannerContainer><AgoraBannerText>인기 아고라가 없습니다.</AgoraBannerText></AgoraBannerContainer>;
    }

    // 복제 슬라이드 포함 배열
    const extendedAgoras = [...popularAgoras, popularAgoras[0]];

    return (
        <AgoraBannerContainer>
            <SlideWrapper>
                <SlideContent
                    ref={slideRef}
                    $currentIndex={currentIndex}
                    $isTransitioning={isTransitioning}
                >
                    {extendedAgoras.map((agora, i) => (
                        <SlideItem key={i} onClick={() => { setSelectedAgora(agora); setIsStartModalOpen(true); }}>
                            <AgoraBannerRow>
                                <AgoraBannerText>지금 인기있는 아고라</AgoraBannerText>
                                <AgoraBannerUserCount>
                                    <UserIconWrapper>
                                        <img src={userProfileIcon} alt="user profile icon" />
                                    </UserIconWrapper>
                                    {agora.currentParticipants}명
                                </AgoraBannerUserCount>
                            </AgoraBannerRow>
                            <AgoraBannerTitle>{agora.title}</AgoraBannerTitle>
                            <AgoraBannerRow>
                                <AgoraBannerText>{getStatusText(agora.status)}</AgoraBannerText>
                            </AgoraBannerRow>
                        </SlideItem>
                    ))}
                </SlideContent>
            </SlideWrapper>

            {/* 인디케이터 */}
            {popularAgoras.length > 1 && (
                <SlideIndicator>
                    {popularAgoras.map((_, index) => (
                        <IndicatorDot key={index} $active={index === (currentIndex % popularAgoras.length)} />
                    ))}
                </SlideIndicator>
            )}
            <AgoraStartModal
                isOpen={isStartModalOpen}
                onClose={() => { setIsStartModalOpen(false); }}
                agora={selectedAgora} // 선택된 아고라 정보 전달
            />
        </AgoraBannerContainer>
    );
};

export default AgoraBanner;

const AgoraBannerContainer = styled.div`
    width: 100%;
    height: 140px;
    background: linear-gradient(
        180deg,
        rgba(6, 6, 250, 0.6) 26.37%,
        rgba(132, 132, 255, 0.24) 128.67%
    );
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
    padding: 20px 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    overflow: hidden;
`;

const SlideWrapper = styled.div`
    flex: 1;
    overflow: hidden;
`;

const SlideContent = styled.div`
    display: flex;
    width: ${({ $length }) => `${$length * 100}%`};
    transform: translateX(${({ $currentIndex }) => `-${$currentIndex * 100}%`});
    transition: ${({ $isTransitioning }) =>
        $isTransitioning ? "transform 0.6s ease-in-out" : "none"};
`;

const SlideItem = styled.div`
    width: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const AgoraBannerRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AgoraBannerText = styled.span`
    color: #fff;
    font-weight: 500;
    font-size: 12px;
`;

const AgoraBannerUserCount = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    color: #fff;
    font-weight: 700;
    font-size: 12px;
`;

const UserIconWrapper = styled.div`
    width: 12px;
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AgoraBannerTitle = styled.div`
    color: #fff;
    font-weight: 700;
    font-size: 24px;
`;

const SlideIndicator = styled.div`
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 8px;
`;

const IndicatorDot = styled.div`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ $active }) =>
        $active ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.4)"};
    transition: background-color 0.3s ease;
`;
