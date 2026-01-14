/**
 * FoodDetailModal.tsx
 * 음식 상세 정보 모달 컴포넌트
 * - 음식 이미지, 칼로리, 영양소 정보 표시
 * - 100g/100ml 기준 영양 정보
 */

import { X } from 'lucide-react';
import { FoodItem } from '../../../data/foods';

/**
 * 컴포넌트 Props 타입 정의
 */
interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

/**
 * FoodDetailModal 컴포넌트
 * 음식 상세 정보를 모달로 표시
 */
export default function FoodDetailModal({ food, onClose }: FoodDetailModalProps) {
  /**
   * food가 null이면 렌더링하지 않음
   */
  if (!food) return null;

  /**
   * 모달 외부 클릭 시 닫기
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 단위 라벨 (g 또는 ml)
   */
  const unitLabel = food.unit === 'ml' ? '100ml' : '100g';

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="modal-title">{food.name}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 모달 콘텐츠 */}
        <div className="food-detail-content">
          {/* 음식 이미지 */}
          <div className="food-detail-image-wrapper">
            <img 
              src={food.image} 
              alt={food.name}
              className="food-detail-image"
            />
          </div>

          {/* 칼로리 정보 */}
          <div className="food-detail-calories">
            <span className="food-detail-calories-value">{food.calories}</span>
            <span className="food-detail-calories-unit">kcal / {unitLabel}</span>
          </div>

          {/* 영양소 정보 */}
          <div className="food-detail-nutrients">
            <div className="food-detail-nutrient">
              <span className="food-detail-nutrient-label">탄수화물</span>
              <span className="food-detail-nutrient-value">{food.nutrients.carb}g</span>
            </div>
            <div className="food-detail-nutrient">
              <span className="food-detail-nutrient-label">단백질</span>
              <span className="food-detail-nutrient-value">{food.nutrients.protein}g</span>
            </div>
            <div className="food-detail-nutrient">
              <span className="food-detail-nutrient-label">지방</span>
              <span className="food-detail-nutrient-value">{food.nutrients.fat}g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}