/**
 * calendar.ts
 * 캘린더 API 함수
 *
 * API 명세:
 * - GET /api/me/calendar/weekly - 주간 컬러코드
 * - GET /api/calendar/day/{date} - 일일 상세
 * - GET /api/me/workouts/days/{date} - 날짜별 운동 조회
 * - PATCH /api/me/workout-items/{workoutItemId}/check - 운동 체크박스
 * - PATCH /api/diet-meal-items/{dietMealItemId}/check - 식단 체크박스
 */

import apiClient from './client';
import {
  WeeklyCalendarResponse,
  DailyDetailResponse,
  WorkoutDayResponse,
  WorkoutCheckRequest,
  WorkoutCheckResponse,
  DietCheckRequest,
  DietCheckResponse,
} from './types/calendar';

/**
 * ===========================================
 * 주간 컬러코드 조회
 * GET /api/me/calendar/weekly?startDate={startDate}
 * ===========================================
 */

/**
 * 주간 캘린더 상태 조회 (마커 표시용)
 * @param startDate - 시작 날짜 (YYYY-MM-DD)
 * @returns 주간 상태 정보
 */
export const getWeeklyCalendar = async (
  startDate: string
): Promise<WeeklyCalendarResponse> => {
  const response = await apiClient.get<{
    success: boolean;
    data: WeeklyCalendarResponse;
  }>('/api/me/calendar/weekly', { params: { startDate } });
  return response.data.data;
};

/**
 * ===========================================
 * 일일 상세 조회
 * GET /api/calendar/day/{date}
 * ===========================================
 */

/**
 * 일일 상세 정보 조회 (운동/식단/PT/메모 요약)
 * @param date - 날짜 (YYYY-MM-DD)
 * @returns 일일 상세 정보
 */
export const getDailyDetail = async (
  date: string
): Promise<DailyDetailResponse> => {
  const response = await apiClient.get<{
    success: boolean;
    data: DailyDetailResponse;
  }>(`/api/calendar/day/${date}`);
  return response.data.data;
};

/**
 * ===========================================
 * 날짜별 운동 조회
 * GET /api/me/workouts/days/{date}
 * ===========================================
 */

/**
 * 특정 날짜 운동 계획 조회
 * @param date - 날짜 (YYYY-MM-DD)
 * @returns 운동 계획 정보
 */
export const getWorkoutDay = async (
  date: string
): Promise<WorkoutDayResponse> => {
  const response = await apiClient.get<{
    success: boolean;
    data: WorkoutDayResponse;
  }>(`/api/me/workouts/days/${date}`);
  return response.data.data;
};

/**
 * ===========================================
 * 운동 체크박스 업데이트
 * PATCH /api/me/workout-items/{workoutItemId}/check
 * ===========================================
 */

/**
 * 운동 항목 체크 상태 변경
 * @param workoutItemId - 운동 항목 ID
 * @param checked - 체크 여부
 * @returns 업데이트 결과
 */
export const updateWorkoutCheck = async (
  workoutItemId: number,
  checked: boolean
): Promise<WorkoutCheckResponse> => {
  const request: WorkoutCheckRequest = { checked };

  const response = await apiClient.patch<{
    success: boolean;
    data: WorkoutCheckResponse;
  }>(`/api/me/workout-items/${workoutItemId}/check`, request);
  return response.data.data;
};

/**
 * ===========================================
 * 식단 체크박스 업데이트
 * PATCH /api/diet-meal-items/{dietMealItemId}/check
 * ===========================================
 */

/**
 * 식단 항목 체크 상태 변경
 * @param dietMealItemId - 식단 항목 ID
 * @param checked - 체크 여부
 * @returns 업데이트 결과
 */
export const updateDietCheck = async (
  dietMealItemId: number,
  checked: boolean
): Promise<DietCheckResponse> => {
  const request: DietCheckRequest = { checked };

  const response = await apiClient.patch<{
    success: boolean;
    data: DietCheckResponse;
  }>(`/api/diet-meal-items/${dietMealItemId}/check`, request);
  return response.data.data;
};