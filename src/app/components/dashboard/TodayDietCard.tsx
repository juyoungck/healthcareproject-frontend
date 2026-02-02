/**
 * TodayDietCard.tsx
 * 오늘의 식단 카드 컴포넌트
 */

import { Utensils, Check, ExternalLink } from 'lucide-react';
import type { DailyDietResponse, DietMeal } from '../../../api/types/dietplan';

/**
 * Props 타입 정의
 */
interface TodayDietCardProps {
  diet: DailyDietResponse;
  onToggleMeal: (meal: DietMeal) => void;
  onViewAll: () => void;
  onMealClick: (mealIndex: number) => void;
}

/**
 * TodayDietCard 컴포넌트
 */
export default function TodayDietCard({
  diet,
  onToggleMeal,
  onViewAll,
  onMealClick,
}: TodayDietCardProps) {
  /* 총 칼로리 계산 */
  const totalCalories = diet.meals.reduce((sum, meal) =>
    sum + meal.items.reduce((s, item) => s + item.calories, 0), 0
  );

  return (
    <div className="today-diet-card">
      <div className="today-diet-header" onClick={onViewAll}>
        <span className="today-diet-label">오늘의 식단</span>
        <ExternalLink size={16} className="today-diet-arrow" />
      </div>

      {/* 칼로리 헤더 */}
      <div className="today-diet-category">
        <Utensils size={16} className="today-diet-category-icon" />
        <div className="today-diet-category-info">
          <h3 className="today-diet-category-title">{totalCalories}kcal</h3>
          <p className="today-diet-category-meta">{diet.meals.length}끼 식단</p>
        </div>
      </div>

      {/* 끼니별 리스트 */}
      <ul className="today-diet-list">
        {diet.meals.map((meal, index) => {
          const mealCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
          const menuNames = meal.items.map(item => item.name).join(' + ');
          const allChecked = meal.items.length > 0 && meal.items.every(item => item.isChecked);

          return (
            <li
              key={meal.dietMealId}
              className={`today-diet-item ${allChecked ? 'completed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (meal.items.length > 0) {
                  onToggleMeal(meal);
                }
              }}
            >
              <button className="today-diet-item-check">
                {allChecked ? (
                  <Check size={12} />
                ) : (
                  <div className="today-diet-item-check-empty" />
                )}
              </button>
              <div className="today-diet-item-info">
                <p className="today-diet-item-name">
                  {menuNames.length > 25 ? menuNames.substring(0, 25) + '...' : menuNames}
                </p>
                <p className="today-diet-item-detail">
                  {meal.title} • {mealCalories}kcal
                </p>
              </div>
              <ExternalLink
                size={16}
                className="today-exercise-item-arrow"
                onClick={(e) => {
                  e.stopPropagation();
                  onMealClick(index);
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
