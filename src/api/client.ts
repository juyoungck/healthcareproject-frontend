/**
 * client.ts
 * axios 인스턴스 및 인터셉터 설정
 * - 요청 시 자동으로 accessToken 헤더 추가
 * - 401 에러 시 토큰 재발급 후 재요청
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * API 기본 URL 설정
 * - .env 파일에서 VITE_API_BASE_URL 환경변수 사용
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * axios 인스턴스 생성
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * - accessToken이 있으면 Authorization 헤더에 추가
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * - 401 에러 시 토큰 재발급 시도
 * - 재발급 성공 시 원래 요청 재시도
 * - 재발급 실패 시 로그아웃 처리
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    /* 401 에러이고 재시도하지 않은 경우 */
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        /* 토큰 재발급 요청 */
        const response = await axios.post(`${BASE_URL}/api/auth/token/reissue`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        /* 새 토큰 저장 */
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        /* 원래 요청 재시도 */
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        /* 토큰 재발급 실패 시 로그아웃 처리 */
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        /* 로그인 페이지로 리다이렉트 (이벤트 발생) */
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;