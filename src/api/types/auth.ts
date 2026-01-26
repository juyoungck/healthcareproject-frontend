/**
 * auth.ts
 * 인증 관련 타입 정의
 */

/**
 * 로그인 요청 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 회원가입 요청 타입
 */
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  phoneNumber?: string;
  profileImageUrl? : string;
}

/**
 * 이메일 중복 체크 요청 타입
 */
export interface EmailCheckRequest {
  email: string;
}

/**
 * 토큰 응답 타입
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * 이메일 중복 체크 응답 타입
 */
export interface EmailCheckResponse {
  available: boolean;
  message: string;
}

/**
 * 토큰 재발급 요청 타입
 */
export interface TokenReissueRequest {
  refreshToken: string;
}

/**
 * 로그아웃 요청 타입
 */
export interface LogoutRequest {
  refreshToken: string;
}

/**
 * API 공통 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * ===========================================
 * 소셜 로그인 관련 타입
 * ===========================================
 */

/**
 * 소셜 제공자 타입
 */
export type SocialProvider = 'GOOGLE' | 'KAKAO' | 'NAVER';

/**
 * 소셜 로그인 요청 타입
 * POST /api/auth/social/login
 */
export interface SocialLoginRequest {
  provider: SocialProvider;
  accessToken: string;
}

/**
 * 소셜 로그인 응답 타입
 */
export interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

/**
 * 소셜 계정 연동 요청 타입
 * POST /api/me/social/connect
 */
export interface SocialConnectRequest {
  provider: SocialProvider;
  accessToken: string;
}

/**
 * 소셜 계정 연동 해제 요청 타입
 * POST /api/me/social/disconnect
 */
export interface SocialDisconnectRequest {
  provider: SocialProvider;
}

/**
 * 소셜 연결 정보 타입
 */
export interface SocialConnection {
  provider: SocialProvider;
  providerUserId: string;
  connectedAt: string;
}

/**
 * 소셜 연결 목록 응답 타입
 * GET /api/auth/social
 */
export interface SocialConnectionsResponse {
  handle: string;
  hasPassword: boolean;
  connections: SocialConnection[];
}