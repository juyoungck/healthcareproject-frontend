/**
 * ai.ts
 * AI 운동/식단 계획 생성 API 함수
 */

import apiClient from './client';
import type {
  WorkoutAiRequest,
  WorkoutAiResponse,
  DietAiRequest,
  DietAiResponse,
} from './types/ai';

/**
 * AI 운동 루틴 생성/재생성
 * PUT /api/workouts/ai/routines
 * 
 * @param request - 날짜 배열 및 추가 요청사항
 * @returns 생성된 운동 계획
 */
export const generateWorkoutPlan = async (request: WorkoutAiRequest): Promise<WorkoutAiResponse> => {
  const response = await apiClient.put('/api/workouts/ai/routines', request);
  return response.data.data;
};

/**
 * AI 식단 7일 계획 생성/재생성
 * PUT /api/diets/ai/week-plans
 * 
 * @param request - 알레르기 배열 및 추가 요청사항
 * @returns 생성된 7일 식단 계획
 */
export const generateDietPlan = async (request: DietAiRequest): Promise<DietAiResponse> => {
  const response = await apiClient.put('/api/diets/ai/week-plans', request);
  return response.data.data;
};