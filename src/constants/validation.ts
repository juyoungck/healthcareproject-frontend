/**
 * validation.ts
 * 유효성 검사 관련 상수
 */

/**
 * ===========================================
 * 입력 길이 제한
 * ===========================================
 */

/** 이메일 인증 코드 길이 */
export const VERIFICATION_CODE_LENGTH = 6;

/** PT 입장 코드 길이 */
export const PT_ENTRY_CODE_LENGTH = 6;

/** 닉네임 최대 길이 */
export const NICKNAME_MAX_LENGTH = 10;

/** 전화번호 최대 길이 (하이픈 포함) */
export const PHONE_MAX_LENGTH = 13;

/** 게시글 제목 최대 길이 */
export const POST_TITLE_MAX_LENGTH = 100;

/** PT방 제목 최대 길이 */
export const PT_ROOM_TITLE_MAX_LENGTH = 50;

/** PT방 설명 최대 길이 */
export const PT_ROOM_DESCRIPTION_MAX_LENGTH = 200;

/**
 * ===========================================
 * 숫자 제한
 * ===========================================
 */

/** 게시글 첨부 이미지 최대 개수 */
export const MAX_POST_IMAGES = 5;

/** PT방 최대 참가자 수 */
export const PT_MAX_PARTICIPANTS = 6;

/** PT방 최소 참가자 수 */
export const PT_MIN_PARTICIPANTS = 2;

/**
 * ===========================================
 * 정규식 패턴
 * ===========================================
 */

/** 비밀번호 패턴 (8자 이상, 영문/숫자/특수문자 각 1개 이상) */
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

/** 이메일 패턴 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ===========================================
 * 타임아웃/폴링 간격 (ms)
 * ===========================================
 */

/** 참가자 목록 폴링 간격 */
export const PARTICIPANT_POLL_INTERVAL = 5000;

/** 클립보드 복사 피드백 표시 시간 */
export const CLIPBOARD_FEEDBACK_DURATION = 2000;

/** PT방 입장 가능 시간 (분) - 시작 전 */
export const PT_ENTRY_WINDOW_BEFORE = 10;

/** PT방 입장 가능 시간 (분) - 시작 후 */
export const PT_ENTRY_WINDOW_AFTER = 60;
