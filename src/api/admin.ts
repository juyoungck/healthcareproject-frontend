/**
 * api/admin.ts
 * 관리자 패널 관련 API 함수
 */

import apiClient from './client';
import type {
  AdminUser,
  AdminPost,
  AdminExercise,
  AdminFood,
  AdminPTRoom,
  TrainerApplicant,
  TrainerPendingResponse,
  Report,
  DashboardStats,
  VersionInfo,
  HealthInfo,
  PaginatedResponse,
  UserRole,
  PostStatus,
  PostCategory,
  ReportStatus,
  ReportType,
  ExercisePart,
  ExerciseLevel,
  AdminPTRoomStatus,
} from './types/admin';

/** API 공통 응답 래퍼 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * ===========================================
 * 회원 관리 API
 * ===========================================
 */

/** 회원 목록 조회 파라미터 */
export interface GetUsersParams {
  page?: number;
  size?: number;
  role?: UserRole;
  keyword?: string;
}

/**
 * 전체 회원 목록 조회
 * GET /api/admin/users
 */
export const getAdminUsers = async (
  params?: GetUsersParams
): Promise<PaginatedResponse<AdminUser>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<AdminUser>>>(
    '/api/admin/users',
    { params }
  );
  return response.data.data;
};

/**
 * 회원 상태 변경
 * PATCH /api/admin/users/{userId}/status
 */
export const updateUserStatus = async (userId: number, status: 'ACTIVE' | 'SUSPENDED'): Promise<void> => {
  await apiClient.patch(`/api/admin/users/${userId}/status`, { status });
};

/**
 * 회원 차단 (SUSPENDED 상태로 변경)
 */
export const banUser = async (userId: number): Promise<void> => {
  await updateUserStatus(userId, 'SUSPENDED');
};

/**
 * 회원 차단 해제 (ACTIVE 상태로 변경)
 */
export const unbanUser = async (userId: number): Promise<void> => {
  await updateUserStatus(userId, 'ACTIVE');
};

/**
 * 회원 강제 탈퇴
 * DELETE /api/admin/users/{userId}
 */
export const deleteUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`/api/admin/users/${userId}`);
};

/**
 * ===========================================
 * 트레이너 승인 API
 * ===========================================
 */

/** 트레이너 대기자 목록 조회 파라미터 */
export interface GetTrainerPendingParams {
  page?: number;
  size?: number;
}

/**
 * 트레이너 승인 대기자 목록 조회
 * GET /api/admin/trainer/pending
 */
export const getTrainerPending = async (
  params?: GetTrainerPendingParams
): Promise<TrainerPendingResponse> => {
  const response = await apiClient.get<ApiResponse<TrainerPendingResponse>>(
    '/api/admin/trainer/pending',
    { params }
  );
  return response.data.data;
};

/**
 * 트레이너 승인
 * PATCH /api/admin/trainer/{handle}/approve
 */
export const approveTrainer = async (handle: string): Promise<void> => {
  await apiClient.patch(`/api/admin/trainer/${handle}/approve`);
};

/**
 * 트레이너 거절
 * PATCH /api/admin/trainer/{handle}/reject
 */
export const rejectTrainer = async (handle: string, reason: string): Promise<void> => {
  await apiClient.patch(`/api/admin/trainer/${handle}/reject`, { reason });
};

/**
 * ===========================================
 * 게시판 관리 API
 * ===========================================
 */

/** 게시글 목록 조회 파라미터 */
export interface GetAdminPostsParams {
  page?: number;
  size?: number;
  category?: PostCategory;
  status?: PostStatus;
  keyword?: string;
}

/**
 * 관리자 게시판 통합 조회
 * GET /api/admin/board
 */
export const getAdminPosts = async (
  params?: GetAdminPostsParams
): Promise<PaginatedResponse<AdminPost>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<AdminPost>>>(
    '/api/admin/board',
    { params }
  );
  return response.data.data;
};

/** 공지사항 등록 데이터 */
export interface CreateNoticeData {
  category: string;
  title: string;
  content: string;
  isNotice: boolean;
}

/**
 * 공지사항 등록
 * POST /api/admin/board/notice
 */
export const createNotice = async (data: CreateNoticeData): Promise<void> => {
  await apiClient.post('/api/admin/board/notice', data);
};

/**
 * 게시글 숨김 처리
 * PATCH /api/admin/board/post/{postId}/hide
 */
export const hidePost = async (postId: number): Promise<void> => {
  await apiClient.patch(`/api/admin/board/post/${postId}/hide`);
};

/**
 * 게시글 공개 처리
 * PATCH /api/admin/board/post/{postId}/show
 */
export const showPost = async (postId: number): Promise<void> => {
  await apiClient.patch(`/api/admin/board/post/${postId}/show`);
};

/**
 * 게시글 삭제
 * DELETE /api/admin/board/post/{postId}
 */
export const deletePost = async (postId: number): Promise<void> => {
  await apiClient.delete(`/api/admin/board/post/${postId}`);
};

/**
 * 게시글 복구
 * PATCH /api/admin/board/post/{postId}/restore
 */
export const restorePost = async (postId: number): Promise<void> => {
  await apiClient.patch(`/api/admin/board/post/${postId}/restore`);
};

/**
 * 게시글 고정/해제
 * PATCH /api/admin/board/post/{postId}/pin
 */
export const togglePinPost = async (postId: number): Promise<void> => {
  await apiClient.patch(`/api/admin/board/post/${postId}/pin`);
};

/**
 * ===========================================
 * 신고 관리 API
 * ===========================================
 */

/** 신고 목록 조회 파라미터 */
export interface GetReportsParams {
  page?: number;
  size?: number;
  status?: ReportStatus;
}

/**
 * 신고 목록 조회
 * GET /api/admin/reports
 */
export const getAdminReports = async (
  params?: GetReportsParams
): Promise<PaginatedResponse<Report>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Report>>>(
    '/api/admin/reports',
    { params }
  );
  return response.data.data;
};

/**
 * 신고 상태 변경
 * PATCH /api/admin/reports/{reportId}/status
 * - PROCESSED: 제재 (신고 대상 삭제)
 * - REJECTED: 반려 (콘텐츠 유지)
 */
export const updateReportStatus = async (
  reportId: number, 
  status: 'PROCESSED' | 'REJECTED'
): Promise<void> => {
  await apiClient.patch(`/api/admin/reports/${reportId}/status`, { status });
};

/**
 * 신고 제재 처리 (PROCESSED)
 * 신고 대상 콘텐츠 삭제
 */
export const processReport = async (reportId: number): Promise<void> => {
  await updateReportStatus(reportId, 'PROCESSED');
};

/**
 * 신고 반려 처리 (REJECTED)
 * 콘텐츠 유지
 */
export const rejectReport = async (reportId: number): Promise<void> => {
  await updateReportStatus(reportId, 'REJECTED');
};

/**
 * ===========================================
 * 운동 관리 API
 * ===========================================
 */

/** 운동 등록/수정 데이터 */
export interface ExerciseData {
  name: string;
  part: ExercisePart;
  level: ExerciseLevel;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}

/** 운동 목록 조회 파라미터 */
export interface GetExercisesParams {
  page?: number;
  size?: number;
  part?: ExercisePart;
  level?: ExerciseLevel;
  keyword?: string;
}

/**
 * 운동 목록 조회 (관리자용)
 * GET /api/admin/exercise
 */
export const getAdminExercises = async (
  params?: GetExercisesParams
): Promise<PaginatedResponse<AdminExercise>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<AdminExercise>>>(
    '/api/admin/exercise',
    { params }
  );
  return response.data.data;
};

/**
 * 운동 데이터 등록
 * POST /api/admin/exercise
 */
export const createExercise = async (data: ExerciseData): Promise<AdminExercise> => {
  const response = await apiClient.post<ApiResponse<AdminExercise>>(
    '/api/admin/exercise',
    data
  );
  return response.data.data;
};

/**
 * 운동 데이터 수정
 * PATCH /api/admin/exercise/{exerciseId}
 */
export const updateExercise = async (
  exerciseId: number,
  data: Partial<ExerciseData>
): Promise<AdminExercise> => {
  const response = await apiClient.patch<ApiResponse<AdminExercise>>(
    `/api/admin/exercise/${exerciseId}`,
    data
  );
  return response.data.data;
};

/**
 * 운동 데이터 삭제
 * DELETE /api/admin/exercise/{exerciseId}
 */
export const deleteExercise = async (exerciseId: number): Promise<void> => {
  await apiClient.delete(`/api/admin/exercise/${exerciseId}`);
};

/**
 * ===========================================
 * 식단 관리 API
 * ===========================================
 */

/** 음식 등록/수정 데이터 */
export interface FoodData {
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  allergies: string[];
  imageUrl?: string;
}

/** 음식 목록 조회 파라미터 */
export interface GetFoodsParams {
  page?: number;
  size?: number;
  keyword?: string;
}

/**
 * 음식 목록 조회 (관리자용)
 * GET /api/admin/food
 */
export const getAdminFoods = async (
  params?: GetFoodsParams
): Promise<PaginatedResponse<AdminFood>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<AdminFood>>>(
    '/api/admin/food',
    { params }
  );
  return response.data.data;
};

/**
 * 음식 데이터 등록
 * POST /api/admin/food
 */
export const createFood = async (data: FoodData): Promise<AdminFood> => {
  const response = await apiClient.post<ApiResponse<AdminFood>>(
    '/api/admin/food',
    data
  );
  return response.data.data;
};

/**
 * 음식 데이터 수정
 * PATCH /api/admin/food/{foodId}
 */
export const updateFood = async (
  foodId: number,
  data: Partial<FoodData>
): Promise<AdminFood> => {
  const response = await apiClient.patch<ApiResponse<AdminFood>>(
    `/api/admin/food/${foodId}`,
    data
  );
  return response.data.data;
};

/**
 * 음식 데이터 삭제
 * DELETE /api/admin/food/{foodId}
 */
export const deleteFood = async (foodId: number): Promise<void> => {
  await apiClient.delete(`/api/admin/food/${foodId}`);
};

/**
 * ===========================================
 * 화상PT 관리 API
 * ===========================================
 */

/** 화상PT 목록 조회 파라미터 */
export interface GetPTRoomsParams {
  status?: AdminPTRoomStatus;
  trainerHandle?: string;
}

/**
 * 화상PT 방 목록 조회 (관리자용)
 * GET /api/admin/pt-rooms
 */
export const getAdminPTRooms = async (
  params?: GetPTRoomsParams
): Promise<PaginatedResponse<AdminPTRoom>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<AdminPTRoom>>>(
    '/api/admin/pt-rooms',
    { params }
  );
  return response.data.data;
};

/**
 * 화상PT 방 강제 종료
 * DELETE /api/admin/pt-rooms/{ptRoomId}
 */
export const forceEndPTRoom = async (ptRoomId: number): Promise<void> => {
  await apiClient.delete(`/api/admin/pt-rooms/${ptRoomId}`);
};

/**
 * ===========================================
 * 대시보드 API
 * ===========================================
 */

/**
 * 대시보드 통계 조회
 * GET /api/admin/dashboard
 */
export const getAdminDashboard = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>(
    '/api/admin/dashboard'
  );
  return response.data.data;
};

/**
 * ===========================================
 * 시스템 API (Version, Health)
 * ===========================================
 */

/**
 * API 버전 정보 조회
 * GET /api/version
 */
export const getVersion = async (): Promise<VersionInfo> => {
  const response = await apiClient.get<ApiResponse<VersionInfo>>('/api/version');
  return response.data.data;
};

/**
 * 헬스 체크
 * GET /api/health
 */
export const getHealth = async (): Promise<HealthInfo> => {
  const response = await apiClient.get<ApiResponse<HealthInfo>>('/api/health');
  return response.data.data;
};