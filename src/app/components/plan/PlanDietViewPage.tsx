/**
 * PlanDietViewPage.tsx
 * 주간 식단 계획 보기 페이지
 * - 요일별 탭
 * - 끼니별 탭 (아침/점심/저녁/간식/간식2) - 하단 푸터 내 배치
 * - 메뉴 리스트 및 체크 기능
 * - 하단 재생성 버튼
 */

import { useState, useMemo } from 'react';
import { Check, ExternalLink, Utensils, RefreshCw, ArrowLeft, Flame } from 'lucide-react';
import type { DietAiResponse, DietDay, DietMeal } from '../../../api/types/ai';

/**
 * Props 타입 정의
 */
interface PlanDietViewPageProps {
  onBack: () => void;
  planData: DietAiResponse;
  completedMeals: { [key: string]: boolean };
  onToggleMeal: (mealKey: string) => void;
  onFoodClick?: (foodId: number) => void;
  onRegenerate?: () => void;
}

/**
 * 요일 라벨 매핑
 */
const DAY_OF_WEEK_SHORT: { [key: number]: string } = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

/**
 * 날짜 포맷 함수 (2026-01-17 → 17(토))
 */
const formatDateTab = (logDate: string): string => {
  const date = new Date(logDate);
  const day = date.getDate();
  const dayOfWeek = DAY_OF_WEEK_SHORT[date.getDay()];
  return `${day}(${dayOfWeek})`;
};

/**
 * PlanDietViewPage 컴포넌트
 */
export default function PlanDietViewPage({
  onBack,
  planData,
  completedMeals,
  onToggleMeal,
  onFoodClick,
  onRegenerate
}: PlanDietViewPageProps) {
  /**
   * 오늘 날짜 (YYYY-MM-DD)
   */
  const today = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  /**
   * 선택된 날짜 (dietDayId)
   */
  const [selectedDayId, setSelectedDayId] = useState<number>(() => {
    /* 오늘 날짜에 해당하는 식단이 있으면 선택, 없으면 첫 번째 */
    const todayPlan = planData.days.find(d => d.logDate === today);
    return todayPlan?.dietDayId || planData.days[0]?.dietDayId || 0;
  });

  /**
   * 선택된 날짜의 식단
   */
  const selectedDayPlan = planData.days.find(d => d.dietDayId === selectedDayId);

  /**
   * 해당 날짜의 완료율 계산
   */
  const getCompletionRate = (dietDay: DietDay) => {
    const total = dietDay.meals.length;
    const completed = dietDay.meals.filter(
      meal => completedMeals[`${dietDay.dietDayId}-${meal.dietMealId}`]
    ).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="diet-view-content-wrapper">
      {/* 헤더 */}
      <header className="diet-view-header">
        <button className="diet-view-back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>목록으로</span>
        </button>
      </header>

      {/* 날짜 탭 */}
      <div className="diet-view-day-tabs">
        {planData.days.map(dietDay => {
          const isSelected = selectedDayId === dietDay.dietDayId;
          const isToday = dietDay.logDate === today;
          const completionRate = getCompletionRate(dietDay);

          return (
            <button
              key={dietDay.dietDayId}
              className={`diet-view-day-tab ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} has-meal ${completionRate === 100 ? 'completed' : ''}`}
              onClick={() => setSelectedDayId(dietDay.dietDayId)}
            >
              <span className="diet-view-day-tab-label">
                {formatDateTab(dietDay.logDate)}
              </span>
              {completionRate > 0 && completionRate < 100 && (
                <span className="diet-view-day-tab-progress">{completionRate}%</span>
              )}
              {completionRate === 100 && (
                <Check size={12} className="diet-view-day-tab-check" />
              )}
            </button>
          );
        })}
      </div>

      {/* 식단 리스트 */}
      <main className="diet-view-content">
        {selectedDayPlan ? (
          <>
            {/* 일일 요약 헤더 */}
            <div className="diet-view-category">
              <Utensils size={20} className="diet-view-category-icon" />
              <div className="diet-view-category-info">
                <h2 className="diet-view-category-title">{selectedDayPlan.summary.totalCalories}kcal</h2>
                <p className="diet-view-category-meta">
                  <Flame size={14} />
                  {selectedDayPlan.summary.mealCount}끼 식단
                </p>
              </div>
            </div>

            {/* 끼니별 목록 */}
            <div className="diet-view-meals-container">
              {selectedDayPlan.meals.map((meal: DietMeal) => {
                const mealKey = `${selectedDayPlan.dietDayId}-${meal.dietMealId}`;
                const isCompleted = completedMeals[mealKey] || meal.isChecked;

                return (
                  <div key={meal.dietMealId} className="diet-view-meal-group">
                    {/* 끼니 헤더 */}
                    <div 
                      className={`diet-view-meal-header ${isCompleted ? 'completed' : ''}`}
                      onClick={() => onToggleMeal(mealKey)}
                    >
                      <div className="diet-view-meal-header-left">
                        <div className="diet-view-item-check">
                          {isCompleted ? <Check size={14} /> : <div className="diet-view-item-check-empty" />}
                        </div>
                        <span className="diet-view-meal-title">🍽 {meal.title}</span>
                      </div>
                      <span className="diet-view-meal-calories">{meal.nutrition.calories}kcal</span>
                    </div>

                    {/* 음식 항목들 */}
                    <ul className="diet-view-list">
                      {meal.items.map(item => (
                        <li
                          key={item.dietMealItemId}
                          className="diet-view-item"
                          onClick={() => onFoodClick?.(item.foodId)}
                        >
                          <div className="diet-view-item-center">
                            <p className="diet-view-item-name">{item.name}</p>
                            <p className="diet-view-item-detail">
                              {item.grams}g × {item.count}개
                            </p>
                          </div>
                          <ExternalLink size={16} className="diet-view-item-arrow" />
                        </li>
                      ))}
                    </ul>

                    {/* 끼니 영양소 요약 */}
                    <div className="diet-view-meal-nutrition">
                      탄 {meal.nutrition.carbs}g · 단 {meal.nutrition.protein}g · 지 {meal.nutrition.fat}g
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="diet-view-rest">
            <div className="diet-view-rest-icon">🍽</div>
            <h2 className="diet-view-rest-title">식단 없음</h2>
            <p className="diet-view-rest-desc">선택된 날짜에 식단이 없습니다</p>
          </div>
        )}
      </main>

      {/* 하단 재생성 버튼 */}
      <footer className="diet-view-footer">
        <button
          className="diet-view-regenerate-btn"
          onClick={onRegenerate}
        >
          <RefreshCw size={18} />
          <span>식단 계획 재생성</span>
        </button>
      </footer>
    </div>
  );
}