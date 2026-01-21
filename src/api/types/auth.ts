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