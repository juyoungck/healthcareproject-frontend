/**
 * DietPage.tsx
 * 식단 메인 페이지 컴포넌트
 * - 검색바 (엔터/버튼으로 검색)
 * - 음식 목록 (2열 카드 그리드)
 * - 카드 클릭 시 상세 모달 팝업
 */

import { useState } from 'react';
import { Search } from 'lucide-react';
import { FoodItem, DUMMY_FOODS } from '../../data/foods';
import FoodDetailModal from '../components/diet/FoodDetailModal';

/**
 * DietPage 컴포넌트
 */
export default function DietPage() {
  /**
   * 상태 관리
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  /**
   * 검색 실행 핸들러
   */
  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  /**
   * 엔터키 검색 핸들러
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 음식 카드 클릭 핸들러
   */
  const handleFoodClick = (food: FoodItem) => {
    setSelectedFood(food);
  };

  /**
   * 모달 닫기 핸들러
   */
  const handleCloseModal = () => {
    setSelectedFood(null);
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
      {/* 검색바 */}
      <div className="diet-search-container">
        <div className="diet-search-bar">
          <input
            type="text"
            className="diet-search-input"
            placeholder="음식을 검색하세요"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="diet-search-btn" onClick={handleSearch}>
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* 음식 목록 */}
      <div className="diet-food-grid">
        {filteredFoods.map((food) => (
          <button
            key={food.id}
            className="diet-food-card"
            onClick={() => handleFoodClick(food)}
          >
            <div className="diet-food-image-wrapper">
              <img
                src={food.image}
                alt={food.name}
                className="diet-food-image"
              />
            </div>
            <p className="diet-food-name">{food.name}</p>
          </button>
        ))}
      </div>

      {/* 검색 결과 없음 */}
      {filteredFoods.length === 0 && (
        <div className="diet-empty">
          <p className="diet-empty-text">검색 결과가 없습니다</p>
        </div>
      )}

      {/* 음식 상세 모달 */}
      <FoodDetailModal food={selectedFood} onClose={handleCloseModal} />
    </div>
  );
}