/**
 * emailVerification.ts
 * 이메일 인증 관련 API 함수
 */

import apiClient from './client';
import type {
  EmailVerificationRequest,
  EmailVerificationConfirmRequest,
  ApiResponse,
} from './types/auth';

/**
 * 이메일 인증 코드 발송
 * POST /api/auth/email/verify/request
 */
export const requestEmailVerification = async (
  data: EmailVerificationRequest
): Promise<void> => {
  await apiClient.post<ApiResponse<void>>(
    '/api/auth/email/verify/request',
    data
  );
};

/**
 * 이메일 인증 코드 확인
 * POST /api/auth/email/verify/confirm
 */
export const confirmEmailVerification = async (
  data: EmailVerificationConfirmRequest
): Promise<void> => {
  await apiClient.post<ApiResponse<void>>(
    '/api/auth/email/verify/confirm',
    data
  );
};