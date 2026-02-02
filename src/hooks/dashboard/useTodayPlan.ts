/**
 * useTodayPlan.ts
 * 오늘 운동/식단 데이터 로딩 및 체크 토글 관련 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { getDailyWorkout, getWeeklyWorkoutStatus, updateWorkoutItemCheck } from '../../api/workout';
import { getDailyDiet, getWeeklyDietStatus, updateDietItemCheck } from '../../api/dietplan';
import type { DailyWorkoutResponse, WorkoutItem } from '../../api/types/workout';
import type { DailyDietResponse, DietMeal } from '../../api/types/dietplan';
import type { WeeklyStatusMap } from '../../api/types/calendar';

/**
 * 반환 타입 인터페이스
 */
interface UseTodayPlanReturn {
  /* 상태 */
  todayWorkout: DailyWorkoutResponse | null;
  todayDiet: DailyDietResponse | null;
  isLoadingToday: boolean;
  weeklyWorkoutStatus: WeeklyStatusMap;
  weeklyDietStatus: WeeklyStatusMap;
  calendarRefreshKey: number;

  /* 액션 */
  loadTodayData: () => Promise<void>;
  handleToggleWorkoutItem: (item: WorkoutItem) => Promise<void>;
  handleToggleMeal: (meal: DietMeal) => Promise<void>;
  hasWeeklyWorkoutPlan: () => boolean;
  hasWeeklyDietPlan: () => boolean;
}

/**
 * 오늘 운동/식단 훅
 */
export function useTodayPlan(): UseTodayPlanReturn {
  /** 상태 */
  const [todayWorkout, setTodayWorkout] = useState<DailyWorkoutResponse | null>(null);
  const [todayDiet, setTodayDiet] = useState<DailyDietResponse | null>(null);
  const [isLoadingToday, setIsLoadingToday] = useState(true);
  const [weeklyWorkoutStatus, setWeeklyWorkoutStatus] = useState<WeeklyStatusMap>({});
  const [weeklyDietStatus, setWeeklyDietStatus] = useState<WeeklyStatusMap>({});
  const [calendarRefreshKey, setCalendarRefreshKey] = useState<number>(0);

  /** 오늘 운동/식단 데이터 로드 */
  const loadTodayData = useCallback(async () => {
    setIsLoadingToday(true);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const endDay = new Date(today);
    endDay.setDate(today.getDate() + 6);
    const startDate = todayStr;
    const endDate = endDay.toISOString().split('T')[0];

    try {
      const workoutData = await getDailyWorkout(todayStr);
      setTodayWorkout(workoutData);
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status !== 404) {
        /** 404 외 에러는 조용히 처리 */
      }
      setTodayWorkout(null);
    }

    try {
      const dietData = await getDailyDiet(todayStr);
      setTodayDiet(dietData);
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status !== 404) {
        /** 404 외 에러는 조용히 처리 */
      }
      setTodayDiet(null);
    }

    try {
      const workoutStatusRes = await getWeeklyWorkoutStatus(startDate, endDate);
      const statusMap: WeeklyStatusMap = {};
      workoutStatusRes.days.forEach(day => {
        statusMap[day.date] = day.status;
      });
      setWeeklyWorkoutStatus(statusMap);
    } catch {
      /** 주간 운동 상태 조회 실패는 조용히 처리 */
    }

    try {
      const dietStatusRes = await getWeeklyDietStatus(startDate, endDate);
      const statusMap: WeeklyStatusMap = {};
      dietStatusRes.days.forEach(day => {
        statusMap[day.date] = day.status;
      });
      setWeeklyDietStatus(statusMap);
    } catch {
      /** 주간 식단 상태 조회 실패는 조용히 처리 */
    }

    setIsLoadingToday(false);
  }, []);

  /** 컴포넌트 마운트 시 데이터 로드 */
  useEffect(() => {
    loadTodayData();
  }, [loadTodayData]);

  /** 주간 운동 계획 존재 여부 */
  const hasWeeklyWorkoutPlan = useCallback((): boolean => {
    return Object.values(weeklyWorkoutStatus).some(
      status => status === 'PLANNED' || status === 'DONE'
    );
  }, [weeklyWorkoutStatus]);

  /** 주간 식단 계획 존재 여부 */
  const hasWeeklyDietPlan = useCallback((): boolean => {
    return Object.values(weeklyDietStatus).some(
      status => status === 'PLANNED' || status === 'DONE'
    );
  }, [weeklyDietStatus]);

  /** 운동 체크 토글 핸들러 */
  const handleToggleWorkoutItem = useCallback(async (item: WorkoutItem) => {
    if (!todayWorkout) return;

    const newChecked = !item.isChecked;

    /* 낙관적 업데이트 */
    setTodayWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map(i =>
          i.workoutItemId === item.workoutItemId
            ? { ...i, isChecked: newChecked }
            : i
        ),
        completedCount: prev.completedCount + (newChecked ? 1 : -1)
      };
    });

    try {
      await updateWorkoutItemCheck(item.workoutItemId, newChecked);
      setCalendarRefreshKey(prev => prev + 1);
    } catch {
      /** 실패 시 롤백 - 에러는 조용히 처리 */
      /* 실패 시 롤백 */
      setTodayWorkout(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map(i =>
            i.workoutItemId === item.workoutItemId
              ? { ...i, isChecked: !newChecked }
              : i
          ),
          completedCount: prev.completedCount + (newChecked ? -1 : 1)
        };
      });
    }
  }, [todayWorkout]);

  /** 끼니 전체 체크 토글 핸들러 */
  const handleToggleMeal = useCallback(async (meal: DietMeal) => {
    if (!todayDiet) return;

    const allChecked = meal.items.length > 0 && meal.items.every(item => item.isChecked);
    const newChecked = !allChecked;

    /* 낙관적 업데이트 */
    setTodayDiet(prev => {
      if (!prev) return null;
      return {
        ...prev,
        meals: prev.meals.map(m =>
          m.dietMealId === meal.dietMealId
            ? {
              ...m,
              items: m.items.map(item => ({ ...item, isChecked: newChecked }))
            }
            : m
        )
      };
    });

    try {
      await Promise.all(
        meal.items.map(item =>
          updateDietItemCheck(item.dietMealItemId, newChecked)
        )
      );
      setCalendarRefreshKey(prev => prev + 1);
    } catch {
      /** 실패 시 롤백 - 에러는 조용히 처리 */
      /* 실패 시 롤백 */
      setTodayDiet(prev => {
        if (!prev) return null;
        return {
          ...prev,
          meals: prev.meals.map(m =>
            m.dietMealId === meal.dietMealId
              ? {
                ...m,
                items: m.items.map(item => ({ ...item, isChecked: !newChecked }))
              }
              : m
          )
        };
      });
    }
  }, [todayDiet]);

  return {
    todayWorkout,
    todayDiet,
    isLoadingToday,
    weeklyWorkoutStatus,
    weeklyDietStatus,
    calendarRefreshKey,
    loadTodayData,
    handleToggleWorkoutItem,
    handleToggleMeal,
    hasWeeklyWorkoutPlan,
    hasWeeklyDietPlan,
  };
}
