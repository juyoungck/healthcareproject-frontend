/**
 * apiError.ts
 * API 에러 처리 유틸리티
 * - 백엔드 에러 응답 추출
 * - errorCodes.ts와 연동
 * - 일관된 에러 메시지 제공
 */

import { getErrorMessage } from '../constants/errorCodes';

/**
 * ===========================================
 * 타입 정의
 * ===========================================
 */

/**
 * API 에러 응답 구조
 */
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/**
 * Axios 에러 구조
 */
interface AxiosErrorLike {
  response?: {
    status?: number;
    data?: ApiErrorResponse | { error?: { code?: string; message?: string } };
  };
  message?: string;
}

/**
 * ===========================================
 * ApiError 클래스
 * ===========================================
 */

/**
 * API 에러 클래스
 * - 에러 코드와 메시지를 함께 관리
 */
export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

/**
 * ===========================================
 * 에러 추출 함수
 * ===========================================
 */

/**
 * Axios 에러에서 에러 정보 추출
 * @param error 에러 객체
 * @param fallback 기본 메시지 (서버 응답이 없을 때)
 * @returns { code: string, message: string }
 */
export const extractAxiosError = (
  error: unknown,
  fallback: string = '오류가 발생했습니다.'
): { code: string; message: string } => {
  /* Axios 에러인지 확인 */
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorLike;
    const data = axiosError.response?.data;

    /* API 에러 응답 구조 확인 */
    if (data && typeof data === 'object') {
      /* { success: false, error: { code, message } } 구조 */
      if ('error' in data && data.error) {
        const errorData = data.error as { code?: string; message?: string };
        const code = errorData.code || 'UNKNOWN';
        /* 서버 메시지 우선, 없으면 errorCodes.ts에서 조회 */
        const message = errorData.message || getErrorMessage(code, fallback);
        return { code, message };
      }
      
      /* { code, message } 직접 구조 (일부 API) */
      if ('code' in data) {
        const directData = data as { code?: string; message?: string };
        const code = directData.code || 'UNKNOWN';
        const message = directData.message || getErrorMessage(code, fallback);
        return { code, message };
      }
    }

    /* 429 Too Many Requests 특별 처리 */
    if (axiosError.response?.status === 429) {
      return {
        code: 'AUTH-008',
        message: getErrorMessage('AUTH-008', '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'),
      };
    }
  }

  /* 일반 Error 객체 */
  if (error instanceof Error) {
    return { code: 'UNKNOWN', message: error.message || fallback };
  }

  return { code: 'UNKNOWN', message: fallback };
};

/**
 * ===========================================
 * 에러 비교 함수
 * ===========================================
 */

/**
 * 에러 코드 비교
 * @param error 에러 객체
 * @param code 비교할 에러 코드
 */
export const isApiErrorCode = (error: unknown, code: string): boolean => {
  const extracted = extractAxiosError(error);
  return extracted.code === code;
};

/**
 * ===========================================
 * 에러 표시 함수
 * ===========================================
 */

/**
 * 에러 메시지 alert 표시
 * @param error 에러 객체
 * @param fallback 기본 메시지
 */
export const alertError = (error: unknown, fallback: string = '오류가 발생했습니다.'): void => {
  const { message } = extractAxiosError(error, fallback);
  alert(message);
};

/**
 * 에러 메시지만 추출
 * @param error 에러 객체
 * @param fallback 기본 메시지
 */
export const getApiErrorMessage = (error: unknown, fallback: string = '오류가 발생했습니다.'): string => {
  const { message } = extractAxiosError(error, fallback);
  return message;
};

/**
 * ===========================================
 * fetch Response용 에러 추출
 * ===========================================
 */

/**
 * fetch Response에서 에러 추출
 * @param response fetch Response 객체
 * @param fallback 기본 메시지
 */
export const extractErrorFromResponse = async (
  response: Response,
  fallback: string = '오류가 발생했습니다.'
): Promise<{ code: string; message: string }> => {
  try {
    const data = await response.json();

    if (data && typeof data === 'object') {
      if ('error' in data && data.error) {
        const code = data.error.code || 'UNKNOWN';
        const message = data.error.message || getErrorMessage(code, fallback);
        return { code, message };
      }
    }
  } catch {
    /* JSON 파싱 실패 시 무시 */
  }

  return { code: 'UNKNOWN', message: fallback };
};

/**
 * fetch Response에서 extractAxiosError 호환 에러 생성
 * - fetch API 사용 시 에러 응답을 throw할 때 사용
 * - extractAxiosError가 인식할 수 있는 구조로 에러 생성
 *
 * @param response fetch Response 객체 (response.ok === false인 경우)
 * @param fallback 기본 메시지
 * @returns extractAxiosError 호환 에러 객체
 *
 * @example
 * if (!response.ok) {
 *   throw await createFetchError(response, '요청에 실패했습니다.');
 * }
 */
export const createFetchError = async (
  response: Response,
  fallback: string = '오류가 발생했습니다.'
): Promise<Error & { response?: { data?: unknown } }> => {
  let errorData: unknown = {};

  try {
    errorData = await response.json();
  } catch {
    /* JSON 파싱 실패 시 무시 */
  }

  /* API 에러 메시지 추출 */
  let message = fallback;
  if (errorData && typeof errorData === 'object' && 'error' in errorData) {
    const apiError = (errorData as { error?: { message?: string } }).error;
    if (apiError?.message) {
      message = apiError.message;
    }
  }

  /* extractAxiosError가 인식할 수 있는 구조로 에러 생성 */
  const error = new Error(message) as Error & {
    response?: { data?: unknown; status?: number };
  };
  error.response = { data: errorData, status: response.status };

  return error;
};
