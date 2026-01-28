/**
 * PlanExerciseViewPage.tsx
 * 주간 운동 계획 보기 페이지
 * - 요일별 탭
 * - 운동 리스트 및 체크 기능
 * - 운동 클릭 시 상세 페이지 이동
 * - 하단 재생성 버튼
 */

import { useState, useEffect, useMemo, useCallback} from 'react';
import { Clock, Check, ExternalLink, Dumbbell, RefreshCw, ArrowLeft } from 'lucide-react';
import { getDailyWorkout, getWeeklyWorkoutStatus, updateWorkoutItemCheck } from '../../../api/workout';
import type { DailyWorkoutResponse, WorkoutItem } from '../../../api/types/workout';
import type { DayStatus, WeeklyStatusMap } from '../../../api/types/calendar';

/**
 * Props 타입 정의
 */
interface PlanExerciseViewPageProps {
  onBack: () => void;
  onExerciseClick?: (exerciseId: number) => void;
  onRegenerate?: () => void;
  onDataChange?: () => void;
}

/**
 * 주간 날짜 배열 생성 (오늘 기준 일요일~토요일)
 */
const getWeekDates = (): string[] => {
  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0(일) ~ 6(토)

  const dates: string[] = [];

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const date = new Date(today);

    if (dayOfWeek < todayDayOfWeek) {
      /* 오늘 이전 요일 → 다음 주 */
      const daysToAdd = 7 - todayDayOfWeek + dayOfWeek;
      date.setDate(today.getDate() + daysToAdd);
    } else {
      /* 오늘 이후 요일 (오늘 포함) → 이번 주 */
      const daysToAdd = dayOfWeek - todayDayOfWeek;
      date.setDate(today.getDate() + daysToAdd);
    }

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
 * PlanExerciseViewPage 컴포넌트
 */
export default function PlanExerciseViewPage({
  onBack,
  onExerciseClick,
  onRegenerate,
  onDataChange
}: PlanExerciseViewPageProps) {
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
   * 주간 상태 (테두리 색상용)
   */
  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatusMap>({});

  /**
   * 날짜별 운동 데이터 캐시
   */
  const [dayCache, setDayCache] = useState<{ [date: string]: DailyWorkoutResponse | null }>({});

  /**
   * 로딩 상태
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 주간 상태 로드
   */
  const loadWeeklyStatus = useCallback(async () => {
    try {
      const today = new Date();
      const endDay = new Date(today);
      endDay.setDate(today.getDate() + 6);

      const startDate = today.toISOString().split('T')[0];
      const endDate = endDay.toISOString().split('T')[0];

      const response = await getWeeklyWorkoutStatus(startDate, endDate);

      const statusMap: WeeklyStatusMap = {};
      response.days.forEach(day => {
        statusMap[day.date] = day.status;
      });
      
      setWeeklyStatus(statusMap);
    } catch (error) {
      console.error('주간 운동 상태 조회 실패:', error);
    }
  }, []);

  /**
   * 특정 날짜 운동 데이터 로드
   */
  const loadDayWorkout = useCallback(async (date: string) => {
    /* 이미 캐시에 있으면 스킵 */
    if (dayCache[date] !== undefined) return;

    setIsLoading(true);
    try {
      const data = await getDailyWorkout(date);
      setDayCache(prev => ({ ...prev, [date]: data }));
    } catch (error: any) {
      /* 404는 해당 날짜에 운동 없음 */
      if (error?.response?.status === 404) {
        setDayCache(prev => ({ ...prev, [date]: null }));
      } else {
        console.error('운동 조회 실패:', error);
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
    loadDayWorkout(todayStr);
  }, [loadWeeklyStatus, loadDayWorkout, todayStr]);

  /**
   * 날짜 탭 클릭 핸들러
   */
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    loadDayWorkout(date);
  };

  /**
   * 현재 선택된 날짜의 운동 데이터
   */
  const currentDayData = dayCache[selectedDate];

  /**
   * 선택된 날짜의 진행률 계산
   */
  const getProgressRate = (): number => {
    if (!currentDayData || currentDayData.items.length === 0) return 0;
    return Math.round((currentDayData.completedCount / currentDayData.exerciseCount) * 100);
  };

  /**
   * 운동 체크 토글 핸들러
   */
  const handleToggleWorkout = async (item: WorkoutItem) => {
    if (!currentDayData) return;

    const newChecked = !item.isChecked;

    /* 낙관적 업데이트 */
    setDayCache(prev => ({
      ...prev,
      [selectedDate]: {
        ...currentDayData,
        items: currentDayData.items.map(i =>
          i.workoutItemId === item.workoutItemId
            ? { ...i, isChecked: newChecked }
            : i
        ),
        completedCount: currentDayData.completedCount + (newChecked ? 1 : -1)
      }
    }));

    try {
      await updateWorkoutItemCheck(item.workoutItemId, newChecked);

      /* 100% 완료 시 주간 상태 새로고침 */
      const newCompletedCount = currentDayData.completedCount + (newChecked ? 1 : -1);
      if (newCompletedCount === currentDayData.exerciseCount || currentDayData.completedCount === currentDayData.exerciseCount) {
        loadWeeklyStatus();
      }

      onDataChange?.();
    } catch (error) {
      console.error('운동 체크 업데이트 실패:', error);
      /* 실패 시 롤백 */
      setDayCache(prev => ({
        ...prev,
        [selectedDate]: currentDayData
      }));
    }
  };

  return (
    <div className="exercise-view-content-wrapper">
      {/* 헤더 */}
      <header className="exercise-view-header">
        <button className="exercise-view-back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>목록으로</span>
        </button>
      </header>

      {/* 요일 탭 */}
      <div className="exercise-view-day-tabs">
        {weekDates.map((date) => {
          const isSelected = selectedDate === date;
          const isToday = date === todayStr;
          const status = weeklyStatus[date] || 'NO_PLAN';
          const progressRate = isSelected ? getProgressRate() : 0;

          return (
            <button
              key={date}
              className={`exercise-view-day-tab ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} status-${(status || 'no_status').toLowerCase()}`}
              onClick={() => handleDateClick(date)}
            >
              <span className="exercise-view-day-tab-label">
                {formatDateTab(date)}
              </span>
              {/* 선택된 날짜: 진행률 표시 */}
              {isSelected && progressRate > 0 && progressRate < 100 && (
                <span className="exercise-view-day-tab-progress">{progressRate}%</span>
              )}
              {/* 선택된 날짜 100% 또는 DONE 상태: 체크 표시 */}
              {((isSelected && progressRate === 100) || (!isSelected && status === 'DONE')) && (
                <Check size={12} className="exercise-view-day-tab-check" />
              )}
            </button>
          );
        })}
      </div>

      {/* 운동 리스트 */}
      <main className="exercise-view-content">
        {isLoading ? (
          <div className="exercise-view-loading">
            <p>로딩 중...</p>
          </div>
        ) : currentDayData ? (
          <>
            {/* 카테고리 헤더 */}
            <div className="exercise-view-category">
              <Dumbbell size={20} className="exercise-view-category-icon" />
              <div className="exercise-view-category-info">
                <h2 className="exercise-view-category-title">{currentDayData.title}</h2>
                <p className="exercise-view-category-meta">
                  <Clock size={14} />
                  {currentDayData.totalMinutes}분 • {currentDayData.exerciseCount}개 운동
                </p>
              </div>
            </div>

            {/* 운동 목록 */}
            <ul className="exercise-view-list">
              {currentDayData.items.map((item) => (
                <li
                  key={item.workoutItemId}
                  className={`exercise-view-item ${item.isChecked ? 'completed' : ''}`}
                  onClick={() => handleToggleWorkout(item)}
                >
                  <div
                    className="exercise-view-item-check"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWorkout(item);
                    }}
                  >
                    {item.isChecked ? <Check size={14} /> : <div className="exercise-view-item-check-empty" />}
                  </div>
                  <div className="exercise-view-item-center">
                    <p className="exercise-view-item-name">{item.name}</p>
                    <p className="exercise-view-item-detail">
                      {item.amount} • 휴식 {item.restSeconds}초
                    </p>
                  </div>
                  {/* 강도 텍스트 */}
                  {item.rpe != null && (
                    <span className="exercise-view-item-rpe">
                      강도 {item.rpe}/10
                    </span>
                  )}
                  <ExternalLink
                    size={20}
                    className="exercise-view-item-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExerciseClick?.(item.exerciseId);
                    }}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="exercise-view-rest">
            <div className="exercise-view-rest-icon">😴</div>
            <h2 className="exercise-view-rest-title">휴식일</h2>
            <p className="exercise-view-rest-desc">오늘은 쉬는 날이에요</p>
          </div>
        )}
      </main>

      {/* 하단 재생성 버튼 */}
      <footer className="exercise-view-footer">
        <button
          className="exercise-view-regenerate-btn"
          onClick={() => onRegenerate?.()}
        >
          <RefreshCw size={18} />
          <span>운동 계획 재생성</span>
        </button>
      </footer>
    </div>
  );
}