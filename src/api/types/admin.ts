/**
 * types/admin.ts
 * 관리자 패널 관련 타입 정의
 */

/**
 * ===========================================
 * 공통 응답 타입
 * ===========================================
 */

/** 페이징 응답 */
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
export type UserStatus = 'ACTIVE' | 'STOP' | 'SLEEP';

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

/** 트레이너 신청 상태 */
export type TrainerApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/** 트레이너 신청 데이터 */
export interface TrainerApplication {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  handle: string;
  introduction: string;
  documents: string[];
  status: TrainerApplicationStatus;
  rejectReason?: string;
  createdAt: string;
  reviewedAt?: string;
}

/**
 * ===========================================
 * 게시글 관련
 * ===========================================
 */

/** 게시글 상태 */
export type PostStatus = 'VISIBLE' | 'HIDDEN' | 'DELETED';

/** 게시글 카테고리 */
export type PostCategory = 'FREE' | 'QUESTION' | 'INFO' | 'NOTICE';

/** 게시글 데이터 (관리자용) */
export interface AdminPost {
  postId: number;
  title: string;
  authorName: string;
  authorHandle: string;
  category: PostCategory;
  status: PostStatus;
  reportCount: number;
  viewCount: number;
  commentCount: number;
  isPinned: boolean;
  createdAt: string;
}

/**
 * ===========================================
 * 신고 관련
 * ===========================================
 */

/** 신고 상태 */
export type ReportStatus = 'PENDING' | 'PROCESSED' | 'IGNORED';

/** 신고 타입 */
export type ReportType = 'POST' | 'COMMENT' | 'USER';

/** 신고 데이터 */
export interface Report {
  reportId: number;
  type: ReportType;
  targetId: number;
  targetTitle: string;
  reporterName: string;
  reporterHandle: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
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

/** 화상PT 방 상태 */
export type PTRoomStatus = 'SCHEDULED' | 'LIVE' | 'ENDED';

/** 화상PT 방 데이터 (관리자용) */
export interface AdminPTRoom {
  ptRoomId: number;
  title: string;
  trainerName: string;
  trainerHandle: string;
  status: PTRoomStatus;
  participantCount: number;
  maxParticipants: number;
  scheduledAt: string;
  createdAt: string;
}

/**
 * ===========================================
 * 통계 관련
 * ===========================================
 */

/** 대시보드 통계 */
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  stopUsers: number;
  sleepUsers: number;
  totalPosts: number;
  visiblePosts: number;
  hiddenPosts: number;
  pendingTrainers: number;
  approvedTrainers: number;
  totalPTRooms: number;
  livePTRooms: number;
  scheduledPTRooms: number;
}

/** 오늘의 활동 */
export interface TodayActivity {
  newUsers: number;
  newTrainerApplications: number;
  newPosts: number;
}

/**
 * ===========================================
 * 시스템 헬스체크 관련
 * ===========================================
 */

/** 서비스 상태 */
export type ServiceStatus = 'HEALTHY' | 'UNHEALTHY' | 'UNKNOWN';

/** 헬스체크 항목 */
export interface HealthCheckItem {
  name: string;
  status: ServiceStatus;
  responseTime?: number;
  lastChecked: string;
  message?: string;
}

/** 에러 로그 */
export interface ErrorLog {
  logId: number;
  level: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  endpoint?: string;
  createdAt: string;
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
  | 'pt'
  | 'stats'
  | 'system';