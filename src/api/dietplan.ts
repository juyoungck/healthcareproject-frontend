import apiClient from './client';
import type {
  DailyDietResponse,
  DietCheckRequest,
  DietCheckResponse,
} from './types/dietplan';
import type { WeeklyStatusResponse } from "./types/calendar";

/**
 * ===========================================
 * 날짜별 식단 계획 API
 * ===========================================
 */

/**
 * 날짜별 식단 조회
 * GET /api/me/diets/days/{date}
 */
export const getDailyDiet = async (date: string): Promise<DailyDietResponse> => {
  const response = await apiClient.get(`/api/me/diets/days/${date}`);
  return response.data.data;
};

/**
 * 식단 항목 체크 업데이트
 * PATCH /api/diet-meal-items/{dietMealItemId}/check
 */
export const updateDietItemCheck = async (
  dietMealItemId: number,
  checked: boolean
): Promise<DietCheckResponse> => {
  const response = await apiClient.patch<{ data: DietCheckResponse }>(
    `/api/diet-meal-items/${dietMealItemId}/check`,
    { checked } as DietCheckRequest
  );
  return response.data.data;
};

/**
 * 주간 식단 상태 조회
 * GET /api/me/diets/status?startDate={startDate}&endDate={endDate}
 */
export const getWeeklyDietStatus = async (
  startDate: string,
  endDate: string
): Promise<WeeklyStatusResponse> => {
  const response = await apiClient.get('/api/me/diets/status', {
    params: { startDate, endDate }
  });
  return response.data.data;
};