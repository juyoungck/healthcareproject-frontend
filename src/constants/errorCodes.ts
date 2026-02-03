/**
 * errorCodes.ts
 * 백엔드 에러 코드 및 메시지 관리
 * - 백엔드 ErrorCode.java와 동기화하여 관리
 * - 최종 동기화: 2026-01-29
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
 * - 백엔드 ErrorCode.java와 동기화
 * ===========================================
 */

export const ERROR_CODES = {
  /**
   * ===========================================
   * Common (COMMON-xxx)
   * ===========================================
   */
  INVALID_REQUEST: { code: 'COMMON-001', message: '요청값이 올바르지 않습니다.' },
  INVALID_DATA: { code: 'COMMON-002', message: '데이터가 유효하지 않습니다.' },
  NOT_FOUND: { code: 'COMMON-404', message: '대상을 찾을 수 없습니다.' },
  ALREADY_EXISTS: { code: 'COMMON-409', message: '이미 존재하는 데이터입니다.' },
  INVALID_STATUS_TRANSITION: { code: 'COMMON-410', message: '유효하지 않은 상태 변경 요청입니다.' },
  INTERNAL_ERROR: { code: 'COMMON-500', message: '서버 오류가 발생했습니다.' },
  INTERNAL_SERVER_ERROR: { code: 'COMMON-501', message: '서버 오류가 발생했습니다.' },

  /**
   * ===========================================
   * AI (AI-xxx)
   * ===========================================
   */
  AI_JSON_PARSE_FAILED: { code: 'AI-001', message: 'AI 응답 처리에 실패했습니다.' },
  AI_ALLOWED_FOODS_BUILD_FAILED: { code: 'AI-002', message: 'AI 생성 준비에 실패했습니다.' },
  AI_INVALID_OUTPUT: { code: 'AI-003', message: 'AI 응답이 유효하지 않습니다.' },
  AI_ALLOWED_EXERCISES_BUILD_FAILED: { code: 'AI-004', message: 'AI 생성 준비에 실패했습니다.' },

  /**
   * ===========================================
   * Auth/Security (AUTH-xxx)
   * ===========================================
   */
  UNAUTHORIZED: { code: 'AUTH-001', message: '인증이 필요합니다.' },
  FORBIDDEN: { code: 'AUTH-002', message: '권한이 없습니다.' },
  INVALID_TOKEN: { code: 'AUTH-003', message: '토큰이 유효하지 않습니다.' },
  EXPIRED_TOKEN: { code: 'AUTH-004', message: '토큰이 만료되었습니다.' },
  LOGIN_FAILED: { code: 'AUTH-005', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
  EMAIL_DUPLICATED: { code: 'AUTH-006', message: '이미 사용 중인 이메일입니다.' },
  HANDLE_DUPLICATED: { code: 'AUTH-007', message: '이미 사용 중인 핸들입니다.' },
  TOO_MANY_REQUESTS: { code: 'AUTH-008', message: '동일한 요청을 너무 많이 생성했습니다.' },
  USER_SUSPENDED: { code: 'AUTH-009', message: '이용이 정지된 계정입니다.' },
  SOCIAL_EMAIL_REQUIRED: { code: 'AUTH-010', message: '소셜 로그인에 이메일이 필요합니다.' },
  SOCIAL_ACCOUNT_TAKEN: { code: 'AUTH-011', message: '이미 연동된 프로바이더입니다.' },
  SOCIAL_ALREADY_CONNECTED: { code: 'AUTH-012', message: '이미 해당 프로바이더를 연동했습니다.' },
  SOCIAL_ACCOUNT_NOT_CONNECTED: { code: 'AUTH-013', message: '해당 프로바이더가 연결되어있지 않습니다.' },
  CANNOT_DISCONNECT_LAST_LOGIN_METHOD: { code: 'AUTH-014', message: '마지막 로그인 수단입니다.' },
  ALREADY_WITHDRAWN: { code: 'AUTH-015', message: '이미 탈퇴된 회원입니다.' },
  INVALID_INPUT: { code: 'AUTH-016', message: '입력값이 올바르지 않습니다.' },
  INVALID_PASSWORD: { code: 'AUTH-017', message: '비밀번호가 일치하지 않습니다.' },
  USER_EMAIL_NOT_VERIFIED: { code: 'AUTH-018', message: '인증되지 않은 이메일입니다.' },

  /**
   * ===========================================
   * User (USER-xxx)
   * ===========================================
   */
  USER_NOT_FOUND: { code: 'USER-001', message: '사용자를 찾을 수 없습니다.' },
  INVALID_INJURY_LEVEL: { code: 'USER-002', message: '부상 레벨이 존재하지 않습니다.' },
  INVALID_ALLERGY_TYPE: { code: 'USER-003', message: '알러지 타입이 존재하지 않습니다.' },

  /**
   * ===========================================
   * Community (COMMUNITY-xxx)
   * ===========================================
   */
  POST_NOT_FOUND: { code: 'COMMUNITY-001', message: '게시글을 찾을 수 없습니다.' },
  NOT_POST_AUTHOR: { code: 'COMMUNITY-002', message: '게시글 수정/삭제 권한이 없습니다.' },
  COMMENT_NOT_FOUND: { code: 'COMMUNITY-003', message: '댓글을 찾을 수 없습니다.' },
  NOT_COMMENT_AUTHOR: { code: 'COMMUNITY-004', message: '댓글 작성자만 수정/삭제할 수 있습니다.' },
  INVALID_INPUT_VALUE: { code: 'COMMUNITY-005', message: '잘못된 입력값입니다.' },
  SELF_REPORT_NOT_ALLOWED: { code: 'COMMUNITY-006', message: '본인의 게시글 또는 댓글은 신고할 수 없습니다.' },
  NOTICE_REPORT_NOT_ALLOWED: { code: 'COMMUNITY-007', message: '공지사항은 신고할 수 없습니다.' },
  ALREADY_REPORTED: { code: 'COMMUNITY-008', message: '이미 신고한 게시글 또는 댓글입니다.' },

  /**
   * ===========================================
   * PT (PT-xxx)
   * ===========================================
   */
  RESERVATION_NOT_ALLOWED: { code: 'PT-001', message: '예약이 불가능한 상태입니다.' },
  ROOM_FULL: { code: 'PT-002', message: '방의 정원이 초과되었습니다.' },
  ALREADY_RESERVED: { code: 'PT-003', message: '이미 예약된 상태입니다.' },
  INVALID_ENTRY_CODE: { code: 'PT-004', message: '참여 코드가 일치하지 않습니다.' },
  CANCEL_NOT_ALLOWED: { code: 'PT-005', message: '진행 중이거나 종료된 방의 예약은 취소할 수 없습니다.' },
  NOT_JOINED: { code: 'PT-006', message: '해당 사용자는 현재 방에 참여 중이 아닙니다.' },
  ROOM_NOT_FOUND: { code: 'PT-007', message: '존재하지 않는 방입니다.' },
  KICKED_USER: { code: 'KICKED', message: '강퇴된 방에는 다시 입장할 수 없습니다.' },

  /**
   * ===========================================
   * Exercise (EXERCISE-xxx)
   * ===========================================
   */
  EXERCISE_NOT_FOUND: { code: 'EXERCISE-001', message: '운동을 찾을 수 없습니다.' },

  /**
   * ===========================================
   * Food (FOOD-xxx)
   * ===========================================
   */
  FOOD_NOT_FOUND: { code: 'FOOD-001', message: '음식을 찾을 수 없습니다.' },

  /**
   * ===========================================
   * Workout (WORKOUT-xxx)
   * ===========================================
   */
  WORKOUT_DAY_NOT_FOUND: { code: 'WORKOUT-001', message: '해당 날짜의 운동 계획이 없습니다.' },
  WORKOUT_ITEM_NOT_FOUND: { code: 'WORKOUT-002', message: '운동 항목을 찾을 수 없습니다.' },

  /**
   * ===========================================
   * Diet (DIET-xxx)
   * ===========================================
   */
  DIET_DAY_NOT_FOUND: { code: 'DIET-001', message: '해당 날짜의 식단 기록이 없습니다.' },
  DIET_MEAL_ITEM_NOT_FOUND: { code: 'DIET-002', message: '식단 항목을 찾을 수 없습니다.' },

  /**
   * ===========================================
   * Trainer (TRAINER-xxx)
   * ===========================================
   */
  NOT_TRAINER: { code: 'TRAINER-001', message: '트레이너 권한이 필요합니다.' },

  /**
   * ===========================================
   * Admin (ADMIN-xxx)
   * ===========================================
   */
  USER_ALREADY_BANNED: { code: 'ADMIN-001', message: '이미 차단된 회원입니다.' },
  USER_NOT_BANNED: { code: 'ADMIN-002', message: '차단되지 않은 회원입니다.' },
  CANNOT_BAN_ADMIN: { code: 'ADMIN-003', message: '관리자는 차단할 수 없습니다.' },
  TRAINER_APPLICATION_NOT_FOUND: { code: 'ADMIN-004', message: '트레이너 신청 내역이 없습니다.' },
  TRAINER_REJECT_REASON_REQUIRED: { code: 'ADMIN-005', message: '거절 사유를 입력해주세요.' },
  REPORT_NOT_FOUND: { code: 'ADMIN-006', message: '신고 내역을 찾을 수 없습니다.' },

  /**
   * ===========================================
   * Upload (UPLOAD-xxx)
   * ===========================================
   */
  INVALID_UPLOAD_TYPE: { code: 'UPLOAD-001', message: '지원하지 않는 업로드 타입입니다.' },
  INVALID_FILE_EXTENSION: { code: 'UPLOAD-002', message: '지원하지 않는 파일 형식입니다.' },
  FILE_SIZE_EXCEEDED: { code: 'UPLOAD-003', message: '파일 크기가 10MB를 초과합니다.' },
  PRESIGNED_URL_GENERATION_FAILED: { code: 'UPLOAD-004', message: '업로드 URL 생성에 실패했습니다.' },
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

/**
 * 에러 코드 키 타입
 */
export type ErrorCodeKey = keyof typeof ERROR_CODES;