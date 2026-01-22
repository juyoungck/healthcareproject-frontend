/**
 * FoodDetail.tsx
 * 음식 상세 정보 모달 컴포넌트
 * - 음식 이미지, 칼로리, 영양소 정보 표시
 */

import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { getFoodDetail } from '../../../api/food';
import type { FoodDetail as FoodDetailType } from '../../../api/types/food';

/**
 * 컴포넌트 Props 타입 정의
 */
interface FoodDetailProps {
  foodId: number | null;
  onClose: () => void;
}

/**
 * FoodDetail 컴포넌트
 */
export default function FoodDetail({ foodId, onClose }: FoodDetailProps) {
  /**
   * 상태 관리
   */
  const [food, setFood] = useState<FoodDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * 음식 상세 조회
   */
  useEffect(() => {
    if (foodId === null) {
      setFood(null);
      return;
    }

    const fetchFoodDetail = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await getFoodDetail(foodId);
        setFood(response);
      } catch (err) {
        console.error('음식 상세 조회 실패:', err);
        setError('음식 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodDetail();
  }, [foodId]);

  /**
   * foodId가 null이면 렌더링하지 않음
   */
  if (foodId === null) return null;

  /**
   * 모달 외부 클릭 시 닫기
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 영양 기준 표시 (예: "100g 기준", "1회 제공량")
   */
  const getNutritionLabel = () => {
    if (!food) return '';
    return `${food.nutritionAmount}${food.nutritionUnit}`;
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="modal-title">{food?.name || '음식 상세'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="food-detail-loading">
            <Loader className="spinner" size={32} />
            <p>불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="food-detail-error">
            <p>{error}</p>
          </div>
        )}

        {/* 모달 콘텐츠 */}
        {food && !isLoading && !error && (
          <div className="food-detail-content">
            {/* 음식 이미지 */}
            <div className="food-detail-image-wrapper">
              <img 
                src={food.imageUrl} 
                alt={food.name}
                className="food-detail-image"
              />
            </div>

            {/* 칼로리 정보 */}
            <div className="food-detail-calories">
              <span className="food-detail-calories-value">{food.calories}</span>
              <span className="food-detail-calories-unit">kcal / {getNutritionLabel()}</span>
            </div>

            {/* 영양소 정보 */}
            <div className="food-detail-nutrients">
              <div className="food-detail-nutrient">
                <span className="food-detail-nutrient-label">탄수화물</span>
                <span className="food-detail-nutrient-value">{food.carbs}g</span>
              </div>
              <div className="food-detail-nutrient">
                <span className="food-detail-nutrient-label">단백질</span>
                <span className="food-detail-nutrient-value">{food.proteins}g</span>
              </div>
              <div className="food-detail-nutrient">
                <span className="food-detail-nutrient-label">지방</span>
                <span className="food-detail-nutrient-value">{food.fats}g</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}