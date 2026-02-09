/**
 * api/types/admin.ts
 * 관리자 패널 관련 타입 정의 (API 명세 기준)
 */

import type { PostStatus } from './board';
import type { ReportType } from './report';

/** board.ts, report.ts에서 타입 재내보내기 */
export type { PostStatus, ReportType };

/**
 * ===========================================
 * 공통 응답 타입
 * ===========================================
 */

/** 페이징 응답 (일반) */
export interface PaginatedResponse<T> {
  total: number;
  list: T[];
}

/**
 * ===========================================
 * 회원 관련
 * ===========================================
 */

/** 회원 역할 */
export type UserRole = 'USER' | 'TRAINER' | 'ADMIN';

/** 회원 상태 */
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';

/** 회원 데이터 (관리자용) */
export interface AdminUser {
  userId: number;
  email: string;
  handle: string;
  nickname: string;
  profileImage?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

/**
 * ===========================================
 * 트레이너 신청 관련
 * ===========================================
 */

/** 트레이너 신청자 데이터 (GET /api/admin/trainer/pending) */
export interface TrainerApplicant {
  handle: string;
  nickname: string;
  profileImageUrl?: string;
  licenceUrl: string[];
  bio: string;
  createdAt: string;
}

/** 트레이너 승인 대기자 목록 응답 */
export interface TrainerPendingResponse {
  applicant: TrainerApplicant[];
  page: number;
  size: number;
  totalElements: number;
  hasPrev: boolean;
  hasNext: boolean;
}

/**
 * ===========================================
 * 게시글 관련
 * ===========================================
 */

/** 게시글 카테고리 */
export type PostCategory = 'FREE' | 'QUESTION' | 'INFO' | 'NOTICE';

/** 게시글 작성자 */
export interface PostAuthor {
  nickname: string;
  handle: string;
}

/** 게시글 API 응답 항목 (raw) */
export interface AdminPostListItem {
  postId: number;
  author: PostAuthor;
  category: string;
  title: string;
  viewCount: number;
  isNotice: boolean;
  status?: PostStatus;
  createdAt: string;
}

/** 게시글 데이터 (관리자용) */
export interface AdminPost {
  postId: number;
  authorNickname: string;
  authorHandle: string;
  category: string;
  title: string;
  viewCount: number;
  isNotice: boolean;
  status: PostStatus;
  createdAt: string;
}

/**
 * ===========================================
 * 신고 관련
 * ===========================================
 */

/** 댓글 상태 */
export type CommentStatus = 'PUBLIC' | 'HIDDEN' | 'DELETED';

/** 신고 상태 */
export type ReportStatus = 'PENDING' | 'PROCESSED' | 'REJECTED';

/** 신고 데이터 */
export interface Report {
  reportId: number;
  reporterName: string;
  reporterHandle: string;
  targetAuthorName: string;
  targetAuthorHandle: string;
  type: ReportType;
  targetId: number;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

/** 신고 상세 - 게시글 */
export interface ReportDetailPost {
  title: string;
  authorNickname: string;
  authorHandle: string;
  content: string;
}

/** 신고 상세 - 화상PT 트레이너 정보 */
export interface ReportDetailTrainer {
  nickname: string;
  handle: string;
}

/** 신고 상세 - 화상PT */
export interface ReportDetailPTRoom {
  title: string;
  trainer: ReportDetailTrainer | null;
  description: string;
  maxParticipants: number;
  roomType: string;
  status: string;
  isPrivate: boolean;
  scheduledAt: string | null;
}

/** 신고 상세 - 댓글 */
export interface ReportDetailComment {
  postId: number;
  postTitle: string;
  authorNickname: string;
  authorHandle: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  isLimited?: boolean;
}

/** 신고 상세 데이터 유니온 타입 */
export type ReportDetailData = ReportDetailPost | ReportDetailPTRoom | ReportDetailComment | null;

/** 관리자 댓글 상세 응답 */
export interface AdminCommentDetail {
  commentId: number;
  postId: number;
  postTitle: string;
  author: {
    userId: number;
    nickname: string;
    handle: string;
  };
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * ===========================================
 * 운동 관련
 * ===========================================
 */

/** 운동 부위 */
export type ExercisePart = 'UPPER' | 'LOWER' | 'CORE' | 'FULL';

/** 운동 난이도 */
export type ExerciseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

/** 운동 데이터 (관리자용) */
export interface AdminExercise {
  exerciseId: number;
  name: string;
  part: ExercisePart;
  level: ExerciseLevel;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

/**
 * ===========================================
 * 식단 관련
 * ===========================================
 */

/** 음식 데이터 (관리자용) */
export interface AdminFood {
  foodId: number;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  allergies: string[];
  imageUrl?: string;
  createdAt: string;
}

/**
 * ===========================================
 * 화상PT 관련
 * ===========================================
 */

/** 화상PT 방 상태 (관리자 API) */
export type AdminPTRoomStatus = 'ACTIVE' | 'SCHEDULED' | 'CLOSED';

/** 화상PT 방 타입 */
export type PTRoomType = 'PERSONAL' | 'GROUP';

/** 화상PT 트레이너 정보 */
export interface PTRoomTrainer {
  nickname: string;
  handle: string;
}

/** 화상PT 방 데이터 (관리자용) */
export interface AdminPTRoom {
  ptRoomId: number;
  trainer: PTRoomTrainer;
  title: string;
  roomType: PTRoomType;
  scheduledStartAt: string;
  maxParticipants: number;
  status: AdminPTRoomStatus;
  createdAt: string;
}

/**
 * ===========================================
 * 대시보드 관련
 * ===========================================
 */

/** 대시보드 통계 */
export interface DashboardStats {
  /* 회원 현황 */
  totalUser: number;
  activeUser: number;
  inactiveUser: number;
  /* 게시글 현황 */
  totalPost: number;
  publicPost: number;
  hiddenPost: number;
  /* 트레이너 승인 대기 */
  waitTrainer: number;
  /* 신고 현황 */
  waitReport: number;
  todayReport: number;
  /* 화상PT 현황 */
  totalPt: number;
  livePt: number;
  reservedPt: number;
  /* 오늘의 활동 */
  todayJoin: number;
  todayPost: number;
}

/**
 * ===========================================
 * 시스템 관련 (Version, Health)
 * ===========================================
 */

/** API 버전 정보 */
export interface VersionInfo {
  version: string;
  buildTime?: string;
  name?: string;
}

/** 헬스 체크 응답 */
export interface HealthInfo {
  status: 'UP' | 'DOWN';
}

/**
 * ===========================================
 * 사이드바 메뉴 관련
 * ===========================================
 */

/** 관리자 메뉴 타입 */
export type AdminMenuType =
  | 'dashboard'
  | 'members'
  | 'trainers'
  | 'boards'
  | 'reports'
  | 'exercises'
  | 'diets'
  | 'pt';