/**
 * DietPage.tsx
 * 식단 메인 페이지 컴포넌트
 * - 검색바 (엔터/버튼으로 검색)
 * - 음식 목록 (2열 카드 그리드)
 * - 카드 클릭 시 상세 모달 팝업
 */

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { FoodItem, DUMMY_FOODS } from '../../data/foods';
import FoodDetail from '../components/diet/FoodDetail';

/**
 * Props 타입 정의
 */
interface DietPageProps {
  initialFoodId?: number | string | null;
  onFoodSelect?: (id: string | null) => void;
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
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  /**
   * initialFoodId가 변경되면 해당 음식 선택
   */
  useEffect(() => {
    if (initialFoodId !== null) {
      const foodIdStr = String(initialFoodId);
      const food = DUMMY_FOODS.find(f => f.id === foodIdStr);
      if (food) {
        setSelectedFood(food);
      }
    }
  }, [initialFoodId]);

  /**
   * 음식 카드 클릭 핸들러
   */
  const handleFoodClick = (food: FoodItem) => {
    setSelectedFood(food);
    onFoodSelect?.(food.id);
  };

  /**
   * 모달 닫기 핸들러
   */
  const handleCloseModal = () => {
    setSelectedFood(null);
    onFoodSelect?.(null);
  };

  /**
   * 필터링된 음식 목록
   * TODO: API 연동 시 서버에서 필터링된 데이터를 받아오도록 변경
   */
  const filteredFoods = DUMMY_FOODS.filter((food) => {
    return food.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
          />
        </div>
      </div>

      {/* 음식 목록 */}
      <div className="diet-list">
        {filteredFoods.length > 0 ? (
          <div className="diet-grid">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                className="diet-card"
                onClick={() => handleFoodClick(food)}
              >
                <div className="diet-card-thumbnail">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="diet-card-image"
                  />
                </div>
                <div className="diet-card-info">
                  <p className="diet-card-name">{food.name}</p>
                  <div className="diet-card-tags">
                    <span className="diet-card-tag">{food.calories}kcal</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
      ) : (
        <div className="diet-empty">
          <p className="diet-empty-text">검색 결과가 없습니다</p>
        </div>
      )}

      </div>
      {/* 음식 상세 모달 */}
      <FoodDetail food={selectedFood} onClose={handleCloseModal} />
    </div>
  );
}