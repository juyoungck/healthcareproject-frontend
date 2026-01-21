/**
 * errorCodes.ts
 * 백엔드 에러 코드 및 메시지 관리
 * - 백엔드 ErrorCode.java와 동기화하여 관리
 */

/**
 * 에러 코드 타입 정의
 */
export interface ErrorInfo {
  code: string;
  message: string;
}

/**
 * ===========================================
 * 에러 코드 정의
 * ===========================================
 */

export const ERROR_CODES = {
  /* Common */
  INVALID_REQUEST: { code: 'COMMON-001', message: '요청값이 올바르지 않습니다.' },
  NOT_FOUND: { code: 'COMMON-404', message: '대상을 찾을 수 없습니다.' },
  INTERNAL_ERROR: { code: 'COMMON-500', message: '서버 오류가 발생했습니다.' },

  /* Auth/Security */
  UNAUTHORIZED: { code: 'AUTH-001', message: '인증이 필요합니다.' },
  FORBIDDEN: { code: 'AUTH-002', message: '권한이 없습니다.' },
  INVALID_TOKEN: { code: 'AUTH-003', message: '토큰이 유효하지 않습니다.' },
  EXPIRED_TOKEN: { code: 'AUTH-004', message: '토큰이 만료되었습니다.' },
  LOGIN_FAILED: { code: 'AUTH-005', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
  EMAIL_DUPLICATED: { code: 'AUTH-006', message: '이미 사용 중인 이메일입니다.' },
  HANDLE_DUPLICATED: { code: 'AUTH-007', message: '이미 사용 중인 핸들입니다.' },
  ALREADY_WITHDRAWN: { code: 'AUTH-008', message: '이미 탈퇴된 회원입니다.' },
  INVALID_PASSWORD: { code: 'AUTH-009', message: '비밀번호가 일치하지 않습니다.' },

  /* User */
  USER_NOT_FOUND: { code: 'USER-001', message: '사용자를 찾을 수 없습니다.' },
  INVALID_INJURY_LEVEL: { code: 'USER-002', message: '부상 레벨이 존재하지 않습니다.' },
  INVALID_ALLERGY_TYPE: { code: 'USER-003', message: '알러지 타입이 존재하지 않습니다.' },

  /* Community */
  POST_NOT_FOUND: { code: 'COMMUNITY-001', message: '게시글을 찾을 수 없습니다.' },
  NOT_POST_AUTHOR: { code: 'COMMUNITY-002', message: '게시글 수정/삭제 권한이 없습니다.' },
  COMMENT_NOT_FOUND: { code: 'C001', message: '댓글을 찾을 수 없습니다.' },
  NOT_COMMENT_AUTHOR: { code: 'C002', message: '댓글 작성자만 수정/삭제할 수 있습니다.' },

  /* Exercise */
  EXERCISE_NOT_FOUND: { code: 'EXERCISE-001', message: '운동을 찾을 수 없습니다.' },

  /* Food */
  FOOD_NOT_FOUND: { code: 'FOOD-001', message: '음식을 찾을 수 없습니다.' },

  /* PT */
  INVALID_ENTRY_CODE: { code: 'INVALID_ENTRY_CODE', message: '입장 코드가 일치하지 않습니다.' },
  INVALID_STATUS_TRANSITION: { code: 'INVALID_STATUS_TRANSITION', message: '유효하지 않은 상태 변경 요청입니다.' },
} as const;

/**
 * ===========================================
 * 유틸리티 함수
 * ===========================================
 */

/**
 * 에러 코드로 메시지 조회
 * @param code 서버에서 받은 에러 코드
 * @param fallback 기본 메시지 (매칭되는 코드가 없을 때)
 */
export const getErrorMessage = (code: string | undefined, fallback = '오류가 발생했습니다.'): string => {
  if (!code) return fallback;

  const found = Object.values(ERROR_CODES).find((err) => err.code === code);
  return found?.message || fallback;
};

/**
 * 에러 코드 매칭 여부 확인
 * @param code 서버에서 받은 에러 코드
 * @param errorKey ERROR_CODES의 키
 */
export const isErrorCode = (code: string | undefined, errorKey: keyof typeof ERROR_CODES): boolean => {
  return code === ERROR_CODES[errorKey].code;
};