/**
 * DietPage.tsx
 * 식단 메인 페이지 컴포넌트
 * - 검색바 (엔터/버튼으로 검색)
 * - 음식 목록 (2열 카드 그리드, 무한스크롤)
 * - 카드 클릭 시 상세 모달 팝업
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader } from 'lucide-react';
import { getFoods } from '../../api/food';
import type { FoodListItem } from '../../api/types/food';
import FoodDetail from '../components/diet/FoodDetail';

/**
 * Props 타입 정의
 */
interface DietPageProps {
  initialFoodId?: number | null;
  onFoodSelect?: (id: number | null) => void;
}

/**
 * DietPage 컴포넌트
 */
export default function DietPage({
  initialFoodId = null,
  onFoodSelect
}: DietPageProps = {}) {
  /**
   * 상태 관리
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [foods, setFoods] = useState<FoodListItem[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  /* 로딩/에러 상태 */
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  /* 무한스크롤 */
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /**
   * 음식 리스트 조회
   */
  const fetchFoods = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError('');
    }

    try {
      const response = await getFoods({
        cursor: isLoadMore ? (nextCursor ?? undefined) : undefined,
        limit: 10,
        keyword: searchKeyword || undefined,
      });

      if (isLoadMore) {
        setFoods(prev => [...prev, ...response.items]);
      } else {
        setFoods(response.items);
      }
      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
    } catch (err) {
      console.error('음식 리스트 조회 실패:', err);
      setError('음식 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [nextCursor, searchKeyword]);

  /**
   * 초기 로드 및 검색어 변경 시
   */
  useEffect(() => {
    setNextCursor(null);
    fetchFoods();
  }, [searchKeyword]);

  /**
   * 무한스크롤 Observer
   */
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoadingMore) {
          fetchFoods(true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasNext, isLoadingMore, fetchFoods]);

  /**
   * initialFoodId가 변경되면 해당 음식 선택
   */
  useEffect(() => {
    if (initialFoodId !== null) {
      setSelectedFoodId(initialFoodId);
    }
  }, [initialFoodId]);

  /**
   * 검색 핸들러
   */
  const handleSearch = () => {
    setSearchKeyword(searchQuery);
  };

  /**
   * 엔터키 검색
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 음식 카드 클릭 핸들러
   */
  const handleFoodClick = (foodId: number) => {
    setSelectedFoodId(foodId);
    onFoodSelect?.(foodId);
  };

  /**
   * 모달 닫기 핸들러
   */
  const handleCloseModal = () => {
    setSelectedFoodId(null);
    onFoodSelect?.(null);
  };

  /**
 * 맨 위로 스크롤
 */
  const handleScrollToTop = () => {
    const appMain = document.querySelector('.app-main');
    if (appMain) {
      appMain.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="diet-page">
      {/* 페이지 헤더 */}
      <div className="pt-page-header">
        {/* 검색 입력 */}
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="음식 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="diet-loading">
          <Loader className="spinner" size={32} />
          <p>음식 목록을 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && !isLoading && (
        <div className="diet-error">
          <p>{error}</p>
          <button onClick={() => fetchFoods()}>다시 시도</button>
        </div>
      )}

      {/* 음식 목록 */}
      {!isLoading && !error && (
        <div className="diet-list">
          {foods.length > 0 ? (
            <div className="diet-grid">
              {foods.map((food) => (
                <button
                  key={food.foodId}
                  className="diet-card"
                  onClick={() => handleFoodClick(food.foodId)}
                >
                  <div className="diet-card-thumbnail">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="diet-card-image"
                    />
                  </div>
                  <div className="diet-card-info">
                    <p className="diet-card-name">{food.name}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="diet-empty">
              <p className="diet-empty-text">검색 결과가 없습니다</p>
            </div>
          )}

          {/* 무한스크롤 트리거 */}
          <div ref={loadMoreRef} className="diet-load-more">
            {isLoadingMore && (
              <div className="diet-loading-more">
                <Loader className="spinner" size={24} />
                <span>불러오는 중...</span>
              </div>
            )}
            {!hasNext && foods.length > 0 && (
              <div className="diet-end-section">
                <p className="diet-end-message">모든 음식을 확인했습니다.</p>
                <button
                  className="diet-scroll-top-btn"
                  onClick={handleScrollToTop}
                >
                  맨 위로 올라가기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 음식 상세 모달 */}
      <FoodDetail foodId={selectedFoodId} onClose={handleCloseModal} />
    </div>
  );
}