/**
 * food.ts
 * 음식 관련 API 함수
 */

import apiClient from './client';
import type {
  FoodListResponse,
  FoodDetail,
  FoodListParams,
} from './types/food';

/**
 * 음식 리스트 조회 (무한 스크롤)
 * GET /api/foods
 */
export const getFoods = async (params?: FoodListParams): Promise<FoodListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.cursor !== undefined) queryParams.append('cursor', String(params.cursor));
  if (params?.limit !== undefined) queryParams.append('limit', String(params.limit));
  if (params?.keyword) queryParams.append('keyword', params.keyword);

  const queryString = queryParams.toString();
  const url = queryString ? `/api/foods?${queryString}` : '/api/foods';

  const response = await apiClient.get(url);
  return response.data.data;
};

/**
 * 음식 상세조회
 * GET /api/foods/{foodId}
 */
export const getFoodDetail = async (foodId: number): Promise<FoodDetail> => {
  const response = await apiClient.get(`/api/foods/${foodId}`);
  return response.data.data;
};