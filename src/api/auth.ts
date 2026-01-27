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
  SocialLoginRequest,
  SocialLoginResponse,
  SocialConnectRequest,
  SocialDisconnectRequest,
  SocialConnectionsResponse,
  SocialProvider,
  PasswordResetRequest,
  PasswordResetConfirm,
  MessageResponse,
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
 * ===========================================
 * 비밀번호 재설정 관련
 * ===========================================
 */

/**
 * 비밀번호 재설정 메일 발송
 * POST /api/auth/password/reset/request
 */
export const requestPasswordReset = async (
  data: PasswordResetRequest
): Promise<MessageResponse> => {
  const response = await apiClient.post<ApiResponse<MessageResponse>>(
    '/api/auth/password/reset/request',
    data
  );
  return response.data.data;
};

/**
 * 비밀번호 재설정 완료
 * POST /api/auth/password/reset
 */
export const resetPassword = async (
  data: PasswordResetConfirm
): Promise<MessageResponse> => {
  const response = await apiClient.post<ApiResponse<MessageResponse>>(
    '/api/auth/password/reset',
    data
  );
  return response.data.data;
};

/**
 * ===========================================
 * 토큰 관리 유틸리티
 * ===========================================
 */

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

/**
 * ===========================================
 * 소셜 로그인 관련 API
 * ===========================================
 */

/**
 * 소셜 로그인 API
 * POST /api/auth/social/login
 */
export const socialLogin = async (data: SocialLoginRequest): Promise<SocialLoginResponse> => {
  const response = await apiClient.post<ApiResponse<SocialLoginResponse>>(
    '/api/auth/social/login',
    data
  );
  return response.data.data;
};

/**
 * 소셜 계정 연동 API
 * POST /api/me/social/connect
 */
export const connectSocialAccount = async (data: SocialConnectRequest): Promise<void> => {
  await apiClient.post('/api/me/social/connect', data);
};

/**
 * 소셜 계정 연동 해제 API
 * POST /api/me/social/disconnect
 */
export const disconnectSocialAccount = async (data: SocialDisconnectRequest): Promise<void> => {
  await apiClient.post('/api/me/social/disconnect', data);
};

/**
 * 연동된 소셜 계정 목록 조회 API
 * GET /api/auth/social
 */
export const getSocialConnections = async (): Promise<SocialConnectionsResponse> => {
  const response = await apiClient.get<ApiResponse<SocialConnectionsResponse>>(
    '/api/me/social'
  );
  return response.data.data;
};

/**
 * ===========================================
 * OAuth URL 생성 유틸리티
 * ===========================================
 */

const OAUTH_CONFIG = {
  KAKAO: {
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    clientId: import.meta.env.VITE_KAKAO_CLIENT_ID,
  },
  NAVER: {
    authUrl: 'https://nid.naver.com/oauth2.0/authorize',
    clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
  },
  GOOGLE: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  },
};

const REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI;

/**
 * OAuth 인증 URL 생성
 * @param provider 소셜 제공자
 * @param state 상태값 (CSRF 방지 및 추가 정보 전달용)
 */
export const getOAuthUrl = (provider: SocialProvider, state?: string): string => {
  const config = OAUTH_CONFIG[provider];
  const stateParam = state || provider;

  switch (provider) {
    case 'KAKAO':
      return `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${stateParam}`;

    case 'NAVER':
      return `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${stateParam}`;

    case 'GOOGLE':
      return `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=email%20profile&state=${stateParam}`;

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};