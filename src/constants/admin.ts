/**
 * admin.ts
 * 관리자 페이지 관련 상수 정의
 */

import type {
  PostCategory,
  PostStatus,
  ReportStatus,
  ReportType,
  UserRole,
  UserStatus,
} from '../api/types/admin';
import type { AllergyType } from '../api/types/me';

/**
 * ===========================================
 * 화상PT 상태 (컴포넌트에서 사용하는 실제 값)
 * ===========================================
 */
export type PTRoomStatusValue = 'LIVE' | 'SCHEDULED' | 'ENDED' | 'RESERVED' | 'CANCELLED' | 'FORCE_CLOSED';

/**
 * ===========================================
 * 라벨 매핑
 * ===========================================
 */

/** 게시글 카테고리 라벨 */
export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  FREE: '자유',
  QUESTION: '질문',
  INFO: '정보',
  NOTICE: '공지',
};

/** 게시글 상태 라벨 */
export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  POSTED: '공개',
  DELETED: '비공개',
};

/** 신고 유형 라벨 */
export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  POST: '게시글',
  COMMENT: '댓글',
  PT_ROOM: '화상PT',
};

/** 신고 상태 라벨 */
export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: '대기중',
  PROCESSED: '처리완료',
  REJECTED: '반려',
};

/** 회원 역할 라벨 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  USER: '일반회원',
  TRAINER: '트레이너',
  ADMIN: '관리자',
};

/** 회원 상태 라벨 */
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: '활성',
  STOP: '비활성',
  SUSPENDED: '비활성',
  SLEEP: '휴면',
};

/** 화상PT 상태 라벨 */
export const PT_ROOM_STATUS_LABELS: Record<PTRoomStatusValue, string> = {
  LIVE: '진행중',
  SCHEDULED: '예약',
  RESERVED: '예약',
  ENDED: '종료',
  CANCELLED: '종료',
  FORCE_CLOSED: '강제종료',
};

/** 화상PT 방 타입 라벨 */
export const PT_ROOM_TYPE_LABELS: Record<string, string> = {
  PERSONAL: '개인',
  GROUP: '그룹',
  LIVE: '실시간',
  RESERVED: '예약',
};

/**
 * ===========================================
 * CSS 클래스 매핑
 * ===========================================
 */

/** 신고 유형 CSS 클래스 */
export const REPORT_TYPE_CLASSES: Record<ReportType, string> = {
  POST: 'type-post',
  COMMENT: 'type-comment',
  PT_ROOM: 'type-pt_room',
};

/** 신고 상태 CSS 클래스 */
export const REPORT_STATUS_CLASSES: Record<ReportStatus, string> = {
  PENDING: 'status-pending',
  PROCESSED: 'status-processed',
  REJECTED: 'status-rejected',
};

/** 회원 상태 CSS 클래스 */
export const USER_STATUS_CLASSES: Record<UserStatus, string> = {
  ACTIVE: 'status-active',
  STOP: 'status-inactive',
  SUSPENDED: 'status-inactive',
  SLEEP: 'status-sleep',
};

/** 화상PT 상태 CSS 클래스 */
export const PT_ROOM_STATUS_CLASSES: Record<PTRoomStatusValue, string> = {
  LIVE: 'status-live',
  SCHEDULED: 'status-scheduled',
  RESERVED: 'status-scheduled',
  ENDED: 'status-ended',
  CANCELLED: 'status-ended',
  FORCE_CLOSED: 'status-force-closed',
};

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */

/** 게시글 카테고리 필터 옵션 */
export const POST_CATEGORY_FILTERS: Array<{ value: PostCategory | 'ALL'; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'NOTICE', label: '공지' },
  { value: 'FREE', label: '자유' },
  { value: 'QUESTION', label: '질문' },
  { value: 'INFO', label: '정보' },
];

/** 신고 상태 필터 옵션 */
export const REPORT_STATUS_FILTERS: Array<{ value: ReportStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '대기중' },
  { value: 'PROCESSED', label: '처리완료' },
  { value: 'REJECTED', label: '반려' },
];

/** 회원 역할 필터 옵션 */
export const USER_ROLE_FILTERS: Array<{ value: UserRole | 'ALL'; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'USER', label: '일반회원' },
  { value: 'TRAINER', label: '트레이너' },
  { value: 'ADMIN', label: '관리자' },
];

/** 화상PT 상태 필터 옵션 */
export const PT_ROOM_STATUS_FILTERS: Array<{ value: PTRoomStatusValue | 'ALL'; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'LIVE', label: '진행중' },
  { value: 'SCHEDULED', label: '예약' },
  { value: 'ENDED', label: '종료' },
];

/**
 * ===========================================
 * 알러지 옵션 (식단 관리용)
 * ===========================================
 */

/** 알러지 라벨 (영문 → 한글) */
export const ALLERGY_LABELS: Record<AllergyType, string> = {
  WHEAT: '밀',
  BUCKWHEAT: '메밀',
  SOY: '대두',
  SESAME: '참깨',
  PEANUT: '땅콩',
  TREE_NUT: '견과류',
  CRUSTACEAN: '갑각류',
  MOLLUSK: '연체류',
  FISH: '생선',
  EGG: '계란',
  MILK: '우유',
  BEEF: '소고기',
  PORK: '돼지고기',
  CHICKEN: '닭고기',
  SULFITE: '아황산류',
} as const;

/** 알러지 옵션 (선택 UI용) */
export const ALLERGY_OPTIONS: { label: string; value: AllergyType }[] = [
  { label: '밀', value: 'WHEAT' },
  { label: '메밀', value: 'BUCKWHEAT' },
  { label: '대두', value: 'SOY' },
  { label: '참깨', value: 'SESAME' },
  { label: '땅콩', value: 'PEANUT' },
  { label: '견과류', value: 'TREE_NUT' },
  { label: '갑각류', value: 'CRUSTACEAN' },
  { label: '연체류', value: 'MOLLUSK' },
  { label: '생선', value: 'FISH' },
  { label: '계란', value: 'EGG' },
  { label: '우유', value: 'MILK' },
  { label: '소고기', value: 'BEEF' },
  { label: '돼지고기', value: 'PORK' },
  { label: '닭고기', value: 'CHICKEN' },
  { label: '아황산류', value: 'SULFITE' },
];
