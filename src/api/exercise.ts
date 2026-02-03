/**
 * exercise.ts
 * 운동 관련 API 함수
 */

import apiClient from './client';
import type {
  ExerciseListResponse,
  ExerciseDetailResponse,
  ExerciseListParams,
} from './types/exercise';

/**
 * 운동 리스트 조회 (무한 스크롤)
 * GET /api/exercises
 * - bodyPart, difficulty는 List<string> 형식으로 다중 값 전송
 */
export const getExercises = async (params?: ExerciseListParams): Promise<ExerciseListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.cursor !== undefined) queryParams.append('cursor', String(params.cursor));
  if (params?.limit !== undefined) queryParams.append('limit', String(params.limit));
  if (params?.keyword) queryParams.append('keyword', params.keyword);
  if (params?.bodyParts?.length) {
    params.bodyParts.forEach(part => queryParams.append('bodyPart', part));
  }
  if (params?.difficulties?.length) {
    params.difficulties.forEach(diff => queryParams.append('difficulty', diff));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/exercises?${queryString}` : '/api/exercises';

  const response = await apiClient.get(url);
  return response.data.data;
};

/**
 * 운동 상세조회
 * GET /api/exercises/{exerciseId}
 */
export const getExerciseDetail = async (exerciseId: number): Promise<ExerciseDetailResponse> => {
  const response = await apiClient.get(`/api/exercises/${exerciseId}`);
  return response.data.data;
};