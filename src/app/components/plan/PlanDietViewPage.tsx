/**
 * PlanDietViewPage.tsx
 * 주간 식단 계획 보기 페이지
 * - 요일별 탭
 * - 끼니별 탭 (아침/점심/저녁/간식/간식2) - 하단 푸터 내 배치
 * - 메뉴 리스트 및 체크 기능
 * - 하단 재생성 버튼
 */

import { useState, useMemo } from 'react';
import { Flame, Check, ChevronRight, Utensils, RefreshCw, ArrowLeft } from 'lucide-react';
import { DietPlan } from './PlanDietResult';
import PlanDietRegenerateModal from './PlanDietRegenerateModal';
import { MealType, MEAL_TYPE_LABELS } from '../../../data/plan';

/**
 * Props 타입 정의
 */
interface PlanDietViewPageProps {
  onBack: () => void;
  planData: DietPlan;
  completedMeals: { [key: string]: boolean };
  onToggleMeal: (mealKey: string) => void;
  onFoodClick?: (foodId: number) => void;
  onRegenerate?: (feedback: string) => void;
  initialMealType?: MealType;
}

/**
 * 요일 라벨 (일~토 순서)
 */
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 끼니 탭 순서
 */
const MEAL_TABS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];

/**
 * PlanDietViewPage 컴포넌트
 */
export default function PlanDietViewPage({ 
  onBack, 
  planData, 
  completedMeals,
  onToggleMeal,
  onFoodClick,
  onRegenerate,
  initialMealType = 'breakfast'
}: PlanDietViewPageProps) {
  /**
   * 재생성 모달 상태
   */
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  /**
   * 선택된 끼니 탭
   */
  const [selectedMealType, setSelectedMealType] = useState<MealType>(initialMealType);

  /**
   * 계획 생성일 파싱
   */
  const startDate = useMemo(() => {
    const dateMatch = planData.createdAt.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (dateMatch) {
      return new Date(
        parseInt(dateMatch[1]),
        parseInt(dateMatch[2]) - 1,
        parseInt(dateMatch[3])
      );
    }
    return new Date();
  }, [planData.createdAt]);

  /**
   * 생성일 기준 7일치 날짜를 일~토 순서로 계산
   */
  const weekDates = useMemo(() => {
    const startDayOfWeek = startDate.getDay();
    const dates: { [key: string]: number } = {};
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      let daysToAdd = dayIndex - startDayOfWeek;
      if (daysToAdd < 0) {
        daysToAdd += 7;
      }
      
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + daysToAdd);
      dates[String(dayIndex)] = date.getDate();
    }
    
    return dates;
  }, [startDate]);

  /**
   * 오늘이 어떤 요일 인덱스인지 계산
   */
  const todayDayIndex = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || diffDays >= 7) return -1;
    
    return today.getDay();
  }, [startDate]);

  /**
   * 선택된 요일
   */
  const [selectedDay, setSelectedDay] = useState<string>(
    todayDayIndex >= 0 ? String(todayDayIndex) : String(startDate.getDay())
  );

  /**
   * 선택된 요일의 식단
   */
  const selectedDayMeal = planData.dailyMeals.find(
    meal => meal.dayName === selectedDay
  );

  /**
   * 선택된 끼니의 메뉴들 필터링
   */
  const filteredMeals = useMemo(() => {
    if (!selectedDayMeal) return [];
    return selectedDayMeal.meals.filter(meal => meal.type === selectedMealType);
  }, [selectedDayMeal, selectedMealType]);

  /**
   * 선택된 끼니의 총 칼로리
   */
  const mealTotalCalories = useMemo(() => {
    return filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);
  }, [filteredMeals]);

  /**
   * 요일에 식단이 있는지 확인
   */
  const hasMealForDay = (dayName: string) => {
    return planData.dailyMeals.some(meal => meal.dayName === dayName);
  };

  /**
   * 해당 요일의 완료율 계산
   */
  const getCompletionRate = (dayName: string) => {
    const dayMeal = planData.dailyMeals.find(meal => meal.dayName === dayName);
    if (!dayMeal) return 0;
    
    const total = dayMeal.meals.length;
    const completed = dayMeal.meals.filter(
      m => completedMeals[`${dayName}-${m.id}`]
    ).length;
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  /**
   * 해당 끼니에 메뉴가 있는지 확인
   */
  const hasMealsForType = (mealType: MealType) => {
    if (!selectedDayMeal) return false;
    return selectedDayMeal.meals.some(meal => meal.type === mealType);
  };

  /**
   * 해당 끼니의 완료율 계산
   */
  const getMealTypeCompletionRate = (mealType: MealType) => {
    if (!selectedDayMeal) return 0;
    
    const typeMeals = selectedDayMeal.meals.filter(m => m.type === mealType);
    if (typeMeals.length === 0) return 0;
    
    const completed = typeMeals.filter(
      m => completedMeals[`${selectedDay}-${m.id}`]
    ).length;
    
    return Math.round((completed / typeMeals.length) * 100);
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

      {/* 요일 탭 */}
      <div className="diet-view-day-tabs">
        {['0', '1', '2', '3', '4', '5', '6'].map(day => {
          const hasMeal = hasMealForDay(day);
          const isSelected = selectedDay === day;
          const isToday = String(todayDayIndex) === day;
          const completionRate = getCompletionRate(day);
          
          return (
            <button
              key={day}
              className={`diet-view-day-tab ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasMeal ? 'has-meal' : ''} ${completionRate === 100 ? 'completed' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <span className="diet-view-day-tab-label">
                {weekDates[day]}({DAY_LABELS[parseInt(day)]})
              </span>
              {hasMeal && completionRate > 0 && completionRate < 100 && (
                <span className="diet-view-day-tab-progress">{completionRate}%</span>
              )}
              {completionRate === 100 && (
                <Check size={12} className="diet-view-day-tab-check" />
              )}
            </button>
          );
        })}
      </div>

      {/* 메뉴 리스트 */}
      <main className="diet-view-content">
        {filteredMeals.length > 0 ? (
          <>
            {/* 카테고리 헤더 */}
            <div className="diet-view-category">
              <Utensils size={20} className="diet-view-category-icon" />
              <div className="diet-view-category-info">
                <h2 className="diet-view-category-title">{mealTotalCalories}kcal</h2>
                <p className="diet-view-category-meta">
                  <Flame size={14} />
                  {filteredMeals.length}개 메뉴
                </p>
              </div>
            </div>

            {/* 메뉴 목록 */}
            <ul className="diet-view-list">
              {filteredMeals.map((meal) => {
                const mealKey = `${selectedDay}-${meal.id}`;
                const isCompleted = completedMeals[mealKey];
                
                return (
                  <li 
                    key={meal.id} 
                    className={`diet-view-item ${isCompleted ? 'completed' : ''}`}
                    onClick={() => onFoodClick?.(meal.id)}
                  >
                    <div 
                      className="diet-view-item-check"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMeal(mealKey);
                      }}
                    >
                      {isCompleted ? <Check size={14} /> : <div className="diet-view-item-check-empty" />}
                    </div>
                    <div className="diet-view-item-center">
                      <p className="diet-view-item-name">{meal.menu}</p>
                      <p className="diet-view-item-detail">
                        {meal.calories}kcal • 탄 {meal.nutrients.carb}g 단 {meal.nutrients.protein}g 지 {meal.nutrients.fat}g
                      </p>
                    </div>
                    <ChevronRight size={20} className="diet-view-item-arrow" />
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="diet-view-rest">
            <div className="diet-view-rest-icon">🍽</div>
            <h2 className="diet-view-rest-title">메뉴 없음</h2>
            <p className="diet-view-rest-desc">이 끼니에는 메뉴가 없어요</p>
          </div>
        )}
      </main>

      {/* 하단 고정 영역 (끼니 탭 + 재생성 버튼) */}
      <footer className="diet-view-footer">
        {/* 끼니 탭 */}
        <div className="diet-view-meal-tabs">
          {MEAL_TABS.map(mealType => {
            const isSelected = selectedMealType === mealType;
            const hasMeals = hasMealsForType(mealType);
            const completionRate = getMealTypeCompletionRate(mealType);
            
            return (
              <button
                key={mealType}
                className={`diet-view-meal-tab ${isSelected ? 'selected' : ''} ${hasMeals ? 'has-meals' : ''} ${completionRate === 100 ? 'completed' : ''}`}
                onClick={() => setSelectedMealType(mealType)}
              >
                <span className="diet-view-meal-tab-label">
                  {MEAL_TYPE_LABELS[mealType]}
                </span>
                {hasMeals && completionRate === 100 && (
                  <Check size={10} className="diet-view-meal-tab-check" />
                )}
              </button>
            );
          })}
        </div>

        {/* 재생성 버튼 */}
        <button 
          className="diet-view-regenerate-btn"
          onClick={() => setShowRegenerateModal(true)}
        >
          <RefreshCw size={18} />
          <span>식단 계획 재생성</span>
        </button>
      </footer>

      {/* 재생성 모달 */}
      {showRegenerateModal && (
        <PlanDietRegenerateModal
          onClose={() => setShowRegenerateModal(false)}
          onRegenerate={(feedback) => {
            setShowRegenerateModal(false);
            onRegenerate?.(feedback);
          }}
        />
      )}
    </div>
  );
}