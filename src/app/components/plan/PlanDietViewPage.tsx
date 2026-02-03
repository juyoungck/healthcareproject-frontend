/**
 * PlanDietViewPage.tsx
 * 주간 식단 계획 보기 페이지
 * - 요일별 탭
 * - 끼니별 탭 (아침/점심/저녁/간식/간식2) - 하단 푸터 내 배치
 * - 메뉴 리스트 및 체크 기능
 * - 하단 재생성 버튼
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Check, ExternalLink, Utensils, RefreshCw, ArrowLeft, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDailyDiet, getWeeklyDietStatus, updateDietItemCheck } from '../../../api/dietplan';
import type { DailyDietResponse, DietMealItem } from '../../../api/types/dietplan';
import type { WeeklyStatusMap } from '../../../api/types/calendar';
import { formatDateTab } from '../../../utils/format';

/**
 * Props 타입 정의
 */
interface PlanDietViewPageProps {
  onBack: () => void;
  onFoodClick?: (foodId: number) => void;
  onRegenerate?: () => void;
  initialMealIndex?: number;
  onDataChange?: () => void;
  initialDate?: string;
}

/**
 * PlanDietViewPage 컴포넌트
 */
export default function PlanDietViewPage({
  onBack,
  onFoodClick,
  onRegenerate,
  initialMealIndex = 0,
  onDataChange,
  initialDate
}: PlanDietViewPageProps) {

  /**
     * 특정 날짜가 속한 주의 일요일 계산
     */
  const getSundayOfWeek = (dateStr: string): Date => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - dayOfWeek);
    return sunday;
  };

  /**
   * 주간 시작일 (일요일) 상태
   */
  const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
    const baseDate = initialDate || new Date().toISOString().split('T')[0];
    return getSundayOfWeek(baseDate);
  });

  /**
   * 주간 날짜 배열 생성 (일~토)
   */
  const getWeekDates = useCallback((): string[] => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }, [weekStartDate]);

  /**
   * 주간 날짜 배열
   */
  const weekDates = useMemo(() => getWeekDates(), [getWeekDates]);

  /**
   * 오늘 날짜 (YYYY-MM-DD)
   */
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  /**
   * 선택된 날짜 (초기값: initialDate 또는 오늘)
   */
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (initialDate) return initialDate;
    return todayStr;
  });

  /**
   * 선택된 끼니 인덱스
   */
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(initialMealIndex);

  /**
   * 주간 상태 (테두리 색상용)
   */
  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatusMap>({});

  /**
   * 날짜별 식단 데이터 캐시
   */
  const [dayCache, setDayCache] = useState<{ [date: string]: DailyDietResponse | null }>({});

  /**
   * 로딩 상태
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
     * 주간 상태 로드 (현재 표시 중인 주 범위)
     */
  const loadWeeklyStatus = useCallback(async () => {
    if (weekDates.length === 0) return;

    const startDate = weekDates[0];
    const endDate = weekDates[6];

    try {
      const response = await getWeeklyDietStatus(startDate, endDate);

      const statusMap: WeeklyStatusMap = {};
      response.days.forEach(day => {
        statusMap[day.date] = day.status;
      });

      setWeeklyStatus(statusMap);
    } catch {
      /* 주간 상태 조회 실패 시 무시 */
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
      /* 404는 해당 날짜에 식단 없음 */
      if (error?.response?.status === 404) {
        setDayCache(prev => ({ ...prev, [date]: null }));
      }
      /* 그 외 에러는 무시 */
    } finally {
      setIsLoading(false);
    }
  }, [dayCache]);

  /**
   * 컴포넌트 마운트 시 초기 로드
   */
  useEffect(() => {
    loadWeeklyStatus();
    loadDayDiet(initialDate || todayStr);
  }, []);

  /**
   * 날짜 탭 클릭 핸들러
   */
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedMealIndex(0);
    loadDayDiet(date);
  };

  /**
   * 주 변경 시 상태 리로드
   */
  useEffect(() => {
    loadWeeklyStatus();
    if (!weekDates.includes(selectedDate)) {
      setSelectedDate(weekDates[0]);
      loadDayDiet(weekDates[0]);
    }
  }, [weekStartDate]);

  /**
   * 이전 주로 이동
   */
  const handlePrevWeek = () => {
    const newStart = new Date(weekStartDate);
    newStart.setDate(weekStartDate.getDate() - 7);
    setWeekStartDate(newStart);
  };

  /**
   * 다음 주로 이동
   */
  const handleNextWeek = () => {
    const newStart = new Date(weekStartDate);
    newStart.setDate(weekStartDate.getDate() + 7);
    setWeekStartDate(newStart);
  };

  /**
   * 현재 주 범위 텍스트
   */
  const getWeekRangeText = (): string => {
    const start = new Date(weekDates[0]);
    const end = new Date(weekDates[6]);
    return `${start.getMonth() + 1}/${start.getDate()} ~ ${end.getMonth() + 1}/${end.getDate()}`;
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

    /* 미래 날짜는 체크 불가 */
    if (selectedDate > todayStr) return;

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
    } catch {
      /* 실패 시 롤백 */
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

      {/* 주간 네비게이션 */}
      <div className="diet-view-week-nav">
        <button className="diet-view-week-nav-btn" onClick={handlePrevWeek}>
          <ChevronLeft size={20} />
        </button>
        <span className="diet-view-week-nav-text">{getWeekRangeText()}</span>
        <button className="diet-view-week-nav-btn" onClick={handleNextWeek}>
          <ChevronRight size={20} />
        </button>
      </div>

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
              className={`diet-view-day-tab ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} status-${(status || 'no_status').toLowerCase()}`}
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
                  {currentMeal.items.length}개 메뉴 {currentMeal.items.reduce((sum, item) => sum + item.calories, 0)}kcal
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
                    <p className="diet-view-item-name">{item.name} {item.calories}kcal</p>
                    <p className="diet-view-item-detail">
                      탄수화물 {item.carbs}g • 단백질 {item.proteins}g • 지방 {item.fats}g
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
                    {meal.title}
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