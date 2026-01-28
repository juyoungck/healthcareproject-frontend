import apiClient from './client';
import type {
  DailyWorkoutResponse,
  WorkoutCheckRequest,
  WorkoutCheckResponse,
} from './types/workout';
import type { WeeklyStatusResponse } from "./types/calendar";

/**
 * ===========================================
 * 날짜별 운동 계획 API
 * ===========================================
 */

/**
 * 날짜별 운동 조회
 * GET /api/me/workouts/days/{date}
 */
export const getDailyWorkout = async (date: string): Promise<DailyWorkoutResponse> => {
  const response = await apiClient.get(`/api/me/workouts/days/${date}`);
  return response.data.data;
};

/**
 * 운동 항목 체크 업데이트
 * PATCH /api/me/workout-items/{workoutItemId}/check
 */
export const updateWorkoutItemCheck = async (
  workoutItemId: number,
  checked: boolean
): Promise<WorkoutCheckResponse> => {
  const response = await apiClient.patch<{ data: WorkoutCheckResponse }>(
    `/api/me/workouts/workout-items/${workoutItemId}/check`,
    { checked } as WorkoutCheckRequest
  );
  return response.data.data;
};

/**
 * 주간 운동 상태 조회
 * GET /api/me/workouts/status?startDate={startDate}&endDate={endDate}
 */
export const getWeeklyWorkoutStatus = async (
  startDate: string,
  endDate: string
): Promise<WeeklyStatusResponse> => {
  const response = await apiClient.get('/api/me/workouts/status', {
    params: { startDate, endDate }
  });
  return response.data.data;
};