/**
 * trainer.ts
 * 트레이너 관련 API 함수
 */

import apiClient from './client';
import type {
  TrainerApplicationRequest,
  TrainerApplicationResponse,
  TrainerBioUpdateRequest,
} from './types/trainer';
import type { ApiResponse } from './types/auth';

/**
 * 트레이너 신청
 * POST /api/trainer/application
 */
export const applyTrainer = async (
  data: TrainerApplicationRequest
): Promise<TrainerApplicationResponse> => {
  const response = await apiClient.post<ApiResponse<TrainerApplicationResponse>>(
    '/api/trainer/application',
    data
  );
  return response.data.data;
};

/**
 * 트레이너 소개문구 수정
 * PATCH /api/trainer/bio
 */
export const updateTrainerBio = async (
  data: TrainerBioUpdateRequest
): Promise<void> => {
  await apiClient.patch('/api/trainer/bio', data);
};