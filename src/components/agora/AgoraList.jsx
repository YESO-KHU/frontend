import styled from 'styled-components';
import AgoraCard from './AgoraCard';
import api from '../../api/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import addButton from '../../assets/icons/add_button.svg';
//import { useNavigate } from 'react-router-dom'; // React Router 사용 시

const AgoraList = ({ onSelect, onCreate }) => {
    const [agoraList, setAgoraList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef();
    const isLoadingRef = useRef(false);

    // API 응답 데이터를 기존 형식으로 변환하는 함수
    const transformAgoraData = useCallback((apiData) => {
        return apiData.map(item => {
            // 찬/반 토론일 경우 찬성 + 반대 참가자 수로 계산
            const totalParticipants = item.debateType === 'PROS_CONS'
                ? (item.prosCount || 0) + (item.consCount || 0)
                : item.currentParticipants || 0;

            // 찬/반 토론일 경우 최대 참가자 수도 찬성 + 반대 최대값으로 계산
            const maxParticipants = item.debateType === 'PROS_CONS'
                ? (item.proMaxCount || 0) + (item.conMaxCount || 0)
                : item.maxParticipants || 0;

            return {
                id: item.id,
                title: item.title,
                description: item.description,
                status: item.status.toLowerCase(), // WAITING -> waiting, PROGRESS -> progress
                user: `${totalParticipants} / ${maxParticipants}명`,
                time: item.startedAt ? formatTime(item.startedAt) : '방장시작',
                tag: item.debateType === 'PROS_CONS' ? '찬/반' : '자유',
                // 추가 필드들
                hostNickname: item.hostNickname,
                articleId: item.articleId,
                articleTitle: item.articleTitle,
                prosCount: item.prosCount,
                consCount: item.consCount,
                participantCount: item.participantCount,
                observerCount: item.observerCount,
                createdAt: item.createdAt,
                startedAt: item.startedAt,
                timeLimit: item.timeLimit,
                isPopular: item.isPopular,
                creatorSide: item.creatorSide,
                proMaxCount: item.proMaxCount,
                conMaxCount: item.conMaxCount
            };
        });
    }, []);

    // 시간 포맷팅 함수
    const formatTime = (timeArray) => {
        if (!timeArray || timeArray.length < 6) return '방장시작';
        const [, , , hour, minute] = timeArray;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const getAgoraList = useCallback(async (page = 0, append = false) => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        setLoading(true);
        try {
            const res = await api.get(`/api/agoras?page=${page}&size=10`);
            console.log(res.data);

            const transformedData = transformAgoraData(res.data.response.content);

            if (append) {
                setAgoraList(prev => [...prev, ...transformedData]);
            } else {
                setAgoraList(transformedData);
            }

            setHasMore(!res.data.response.last);
            setCurrentPage(page);
        } catch (error) {
            console.error('아고라 목록 조회 실패:', error);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [transformAgoraData]);

    // 무한스크롤을 위한 Intersection Observer 설정
    const lastAgoraElementRef = useCallback(node => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
                getAgoraList(currentPage + 1, true);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [hasMore, currentPage, getAgoraList]);

    useEffect(() => {
        getAgoraList(0, false);
    }, [getAgoraList]);
    //const navigate = useNavigate();

    return (
        <AgoraListContainer >
            <AgoraListHeader>
                <AgoraListTitle>진행중인 아고라</AgoraListTitle>
                <img src={addButton} alt="add button" onClick={onCreate} style={{ cursor: 'pointer' }} />
            </AgoraListHeader>
            <AgoraCardList>
                {agoraList.map((agora, index) => (
                    <AgoraCard
                        key={agora.id}
                        agora={agora}
                        onClick={() => onSelect(agora)}
                        ref={index === agoraList.length - 1 ? lastAgoraElementRef : null}
                    />
                ))}
                {loading && agoraList.length > 0 && <LoadingText>더 많은 아고라를 불러오는 중...</LoadingText>}
                {loading && agoraList.length === 0 && <LoadingText>아고라를 불러오는 중...</LoadingText>}
                {/* {!hasMore && !loading && agoraList.length > 0 && <EndText>모든 아고라를 불러왔습니다.</EndText>} */}
                {!loading && agoraList.length === 0 && <EndText>진행중인 아고라가 없습니다.</EndText>}
            </AgoraCardList>
        </AgoraListContainer>
    );
}

export default AgoraList;

const AgoraListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 60px 26px 0 26px;
`;

const AgoraListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AgoraListTitle = styled.h2`
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(180deg, rgba(6, 6, 250, 0.6) -5.91%, rgba(132, 132, 255, 0.24) 121.16%);
    -webkit-background-clip: text; /* 박스 전체대신 텍스트에 그라데이션 적용 */
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
`;

const CreateButton = styled.button`
    background-color: ${({ theme }) => theme.lightGray};
    border: none;
    border-radius: 5px;
    padding: 6px 18px;
    cursor: pointer;
`;

const AgoraCardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 20px;
    color: ${({ theme }) => theme.gray};
    font-size: 14px;
`;

const EndText = styled.div`
    text-align: center;
    padding: 20px;
    color: ${({ theme }) => theme.lightGray};
    font-size: 12px;
`;

