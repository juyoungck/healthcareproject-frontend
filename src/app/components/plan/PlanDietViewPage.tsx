/**
 * PlanDietViewPage.tsx
 * 주간 식단 계획 보기 페이지
 * - 요일별 탭
 * - 끼니별 탭 (아침/점심/저녁/간식/간식2) - 하단 푸터 내 배치
 * - 메뉴 리스트 및 체크 기능
 * - 하단 재생성 버튼
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Check, ExternalLink, Utensils, RefreshCw, ArrowLeft, Flame } from 'lucide-react';
import { getDailyDiet, getWeeklyDietStatus, updateDietItemCheck } from '../../../api/dietplan';
import type { DailyDietResponse, DietMealItem } from '../../../api/types/dietplan';
import type { DayStatus } from '../../../api/types/calendar';

/**
 * Props 타입 정의
 */
interface PlanDietViewPageProps {
  onBack: () => void;
  onFoodClick?: (foodId: number) => void;
  onRegenerate?: () => void;
  initialMealIndex?: number;
  onDataChange?: () => void;
}

/**
 * 주간 날짜 배열 생성 (오늘 기준 일요일~토요일)
 */
const getWeekDates = (): string[] => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

/**
 * 날짜 포맷 함수 (2026-01-17 → 17(토))
 */
const formatDateTab = (dateStr: string): string => {
  const date = new Date(dateStr);
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getDate()}(${dayLabels[date.getDay()]})`;
};

/**
 * PlanDietViewPage 컴포넌트
 */
export default function PlanDietViewPage({
  onBack,
  onFoodClick,
  onRegenerate,
  initialMealIndex = 0,
  onDataChange
}: PlanDietViewPageProps) {
  /**
   * 주간 날짜 배열
   */
  const weekDates = useMemo(() => getWeekDates(), []);

  /**
   * 오늘 날짜 (YYYY-MM-DD)
   */
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  /**
   * 선택된 날짜
   */
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  /**
   * 선택된 끼니 인덱스
   */
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(initialMealIndex);

  /**
   * 주간 상태 (테두리 색상용)
   */
  const [weeklyStatus, setWeeklyStatus] = useState<{ [date: string]: DayStatus }>({});

  /**
   * 날짜별 식단 데이터 캐시
   */
  const [dayCache, setDayCache] = useState<{ [date: string]: DailyDietResponse | null }>({});

  /**
   * 로딩 상태
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 주간 상태 로드
   */
  const loadWeeklyStatus = useCallback(async () => {
    try {
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      const status = await getWeeklyDietStatus(startDate, endDate);
      setWeeklyStatus(status);
    } catch (error) {
      console.error('주간 식단 상태 조회 실패:', error);
    }
  }, [weekDates]);

  /**
   * 특정 날짜 식단 데이터 로드
   */
  const loadDayDiet = useCallback(async (date: string) => {
    if (dayCache[date] !== undefined) return;

    setIsLoading(true);
    try {
      const data = await getDailyDiet(date);
      setDayCache(prev => ({ ...prev, [date]: data }));
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setDayCache(prev => ({ ...prev, [date]: null }));
      } else {
        console.error('식단 조회 실패:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [dayCache]);

  /**
   * 컴포넌트 마운트 시 초기 로드
   */
  useEffect(() => {
    loadWeeklyStatus();
    loadDayDiet(todayStr);
  }, [loadWeeklyStatus, loadDayDiet, todayStr]);

  /**
   * 날짜 탭 클릭 핸들러
   */
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedMealIndex(0);
    loadDayDiet(date);
  };

  /**
   * 현재 선택된 날짜의 식단 데이터
   */
  const currentDayData = dayCache[selectedDate];

  /**
   * 현재 선택된 끼니
   */
  const currentMeal = currentDayData?.meals[selectedMealIndex];

  /**
   * 선택된 날짜의 진행률 계산
   */
  const getProgressRate = (): number => {
    if (!currentDayData) return 0;
    const allItems = currentDayData.meals.flatMap(meal => meal.items);
    if (allItems.length === 0) return 0;
    const completedCount = allItems.filter(item => item.isChecked).length;
    return Math.round((completedCount / allItems.length) * 100);
  };

  /**
   * 총 칼로리 계산
   */
  const getTotalCalories = (): number => {
    if (!currentDayData) return 0;
    return currentDayData.meals.reduce((sum, meal) =>
      sum + meal.items.reduce((s, item) => s + item.calories, 0), 0
    );
  };

  /**
   * 식단 체크 토글 핸들러
   */
  const handleToggleDiet = async (item: DietMealItem) => {
    if (!currentDayData) return;

    const newChecked = !item.isChecked;

    /* 낙관적 업데이트 */
    setDayCache(prev => ({
      ...prev,
      [selectedDate]: {
        ...currentDayData,
        meals: currentDayData.meals.map(meal => ({
          ...meal,
          items: meal.items.map(i =>
            i.dietMealItemId === item.dietMealItemId
              ? { ...i, isChecked: newChecked }
              : i
          )
        }))
      }
    }));

    try {
      await updateDietItemCheck(item.dietMealItemId, newChecked);

      /* 완료 상태 변경 시 주간 상태 새로고침 */
      const allItems = currentDayData.meals.flatMap(meal => meal.items);
      const currentCompleted = allItems.filter(i => i.isChecked).length;
      const newCompleted = currentCompleted + (newChecked ? 1 : -1);
      if (newCompleted === allItems.length || currentCompleted === allItems.length) {
        loadWeeklyStatus();
      }

      onDataChange?.();
    } catch (error) {
      console.error('식단 체크 업데이트 실패:', error);
      setDayCache(prev => ({
        ...prev,
        [selectedDate]: currentDayData
      }));
    }
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
        {weekDates.map((date) => {
          const isSelected = selectedDate === date;
          const isToday = date === todayStr;
          const status = weeklyStatus[date] || 'NO_PLAN';
          const progressRate = isSelected ? getProgressRate() : 0;

          return (
            <button
              key={date}
              className={`diet-view-day-tab ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} status-${status.toLowerCase()}`}
              onClick={() => handleDateClick(date)}
            >
              <span className="diet-view-day-tab-label">
                {formatDateTab(date)}
              </span>
              {isSelected && progressRate > 0 && progressRate < 100 && (
                <span className="diet-view-day-tab-progress">{progressRate}%</span>
              )}
              {((isSelected && progressRate === 100) || (!isSelected && status === 'DONE')) && (
                <Check size={12} className="diet-view-day-tab-check" />
              )}
            </button>
          );
        })}
      </div>

      {/* 메뉴 리스트 */}
      <main className="diet-view-content">
        {isLoading ? (
          <div className="diet-view-loading">
            <p>로딩 중...</p>
          </div>
        ) : currentDayData && currentMeal ? (
          <>
            {/* 카테고리 헤더 */}
            <div className="diet-view-category">
              <Utensils size={20} className="diet-view-category-icon" />
              <div className="diet-view-category-info">
                <h2 className="diet-view-category-title">{getTotalCalories()}kcal</h2>
                <p className="diet-view-category-meta">
                  <Flame size={14} />
                  {currentMeal.items.length}개 메뉴
                </p>
              </div>
            </div>

            {/* 메뉴 목록 */}
            <ul className="diet-view-list">
              {currentMeal.items.map((item) => (
                <li
                  key={item.dietMealItemId}
                  className={`diet-view-item ${item.isChecked ? 'completed' : ''}`}
                  onClick={() => handleToggleDiet(item)}
                >
                  <div
                    className="diet-view-item-check"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDiet(item);
                    }}
                  >
                    {item.isChecked ? <Check size={14} /> : <div className="diet-view-item-check-empty" />}
                  </div>
                  <div className="diet-view-item-center">
                    <p className="diet-view-item-name">{item.name}</p>
                    <p className="diet-view-item-detail">
                      {item.calories}kcal • 탄 {item.carbs}g 단 {item.proteins}g 지 {item.fats}g
                    </p>
                  </div>
                  <ExternalLink
                    size={20}
                    className="diet-view-item-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFoodClick?.(item.foodId);
                    }}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="diet-view-rest">
            <div className="diet-view-rest-icon">🍽</div>
            <h2 className="diet-view-rest-title">식단 없음</h2>
            <p className="diet-view-rest-desc">이 날은 식단이 없어요</p>
          </div>
        )}
      </main>

      {/* 하단 고정 영역 */}
      <footer className="diet-view-footer">
        {/* 끼니 탭 */}
        {currentDayData && currentDayData.meals.length > 0 && (
          <div className="diet-view-meal-tabs">
            {currentDayData.meals.map((meal, index) => {
              const isSelected = selectedMealIndex === index;
              const allChecked = meal.items.length > 0 && meal.items.every(item => item.isChecked);

              return (
                <button
                  key={meal.dietMealId}
                  className={`diet-view-meal-tab ${isSelected ? 'selected' : ''} ${allChecked ? 'completed' : ''}`}
                  onClick={() => setSelectedMealIndex(index)}
                >
                  <span className="diet-view-meal-tab-label">
                    식단{index + 1}
                  </span>
                  {allChecked && (
                    <Check size={10} className="diet-view-meal-tab-check" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 재생성 버튼 */}
        <button
          className="diet-view-regenerate-btn"
          onClick={() => onRegenerate?.()}
        >
          <RefreshCw size={18} />
          <span>식단 계획 재생성</span>
        </button>
      </footer>
    </div>
  );
}