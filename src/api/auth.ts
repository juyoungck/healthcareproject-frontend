/**
 * auth.ts
 * 인증 관련 API 함수
 */

import apiClient from './client';
import type {
  LoginRequest,
  SignupRequest,
  EmailCheckRequest,
  TokenResponse,
  EmailCheckResponse,
  LogoutRequest,
  ApiResponse,
} from './types/auth';

/**
 * 로그인 API
 * POST /api/auth/login
 */
export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.post<ApiResponse<TokenResponse>>(
    '/api/auth/login',
    data
  );
  return response.data.data;
};

/**
 * 회원가입 API
 * POST /api/auth/signup
 */
export const signup = async (data: SignupRequest): Promise<TokenResponse> => {
  const response = await apiClient.post<ApiResponse<TokenResponse>>(
    '/api/auth/signup',
    data
  );
  return response.data.data;
};

/**
 * 이메일 중복 체크 API
 * POST /api/auth/email/check
 */
export const checkEmail = async (data: EmailCheckRequest): Promise<EmailCheckResponse> => {
  const response = await apiClient.post<ApiResponse<EmailCheckResponse>>(
    '/api/auth/email/check',
    data
  );
  return response.data.data;
};

/**
 * 로그아웃 API
 * POST /api/auth/logout
 */
export const logout = async (data: LogoutRequest): Promise<void> => {
  await apiClient.post('/api/auth/logout', data);
};

/**
 * 토큰을 로컬스토리지에 저장
 */
export const saveTokens = (tokens: TokenResponse): void => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

/**
 * 토큰 삭제 (로그아웃 시)
 */
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

/**
 * 저장된 refreshToken 가져오기
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};