/**
 * DietPage.tsx
 * 식단 메인 페이지 컴포넌트
 * - 검색바 (엔터/버튼으로 검색)
 * - 음식 목록 (2열 카드 그리드, 무한스크롤)
 * - 카드 클릭 시 상세 모달 팝업
 */

import { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import { useFoodList } from '../../hooks/diet/useFoodList';
import FoodDetail from '../components/diet/FoodDetail';
import { scrollToTop } from '../../utils/format';

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
   * 커스텀 훅 사용
   */
  const {
    foods,
    isLoading,
    isLoadingMore,
    error,
    hasNext,
    searchQuery,
    loadMoreRef,
    setSearchQuery,
    handleSearch,
    fetchFoods,
  } = useFoodList();

  /**
   * 선택된 음식 ID
   */
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  /**
   * initialFoodId가 변경되면 해당 음식 선택
   */
  useEffect(() => {
    if (initialFoodId !== null) {
      setSelectedFoodId(initialFoodId);
    }
  }, [initialFoodId]);

  /**
   * 엔터키 검색
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
            onKeyDown={handleKeyDown}
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
                  className="scroll-top-btn scroll-top-btn-diet"
                  onClick={() => scrollToTop()}
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
