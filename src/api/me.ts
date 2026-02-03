/**
 * me.ts
 * 마이페이지/온보딩 관련 API 함수
 */

import apiClient from './client';
import type {
  OnboardingRequest,
  OnboardingStatusResponse,
  MeResponse,
  ProfileResponse,
  InjuriesResponse,
  AllergiesResponse,
  NicknameUpdateRequest,
  PhoneUpdateRequest,
  ProfileImageUpdateRequest,
  UserUpdateResponse,
  PasswordChangeRequest,
  TrainerInfoResponse,
} from './types/me';
import type { ApiResponse } from './types/auth';

/**
 * ===========================================
 * 온보딩 관련 API
 * ===========================================
 */

/**
 * 온보딩 통합 저장 (생성/수정 공용)
 * PUT /api/me/onboarding
 */
export const saveOnboarding = async (data: OnboardingRequest): Promise<void> => {
  await apiClient.put('/api/me/onboarding', data);
};

/**
 * 온보딩 완료여부 조회
 * GET /api/me/onboarding/status
 */
export const getOnboardingStatus = async (): Promise<OnboardingStatusResponse> => {
  const response = await apiClient.get<ApiResponse<OnboardingStatusResponse>>(
    '/api/me/onboarding/status'
  );
  return response.data.data;
};

/**
 * ===========================================
 * 내 정보 조회 API
 * ===========================================
 */

/**
 * 내 기본정보 조회
 * GET /api/me
 */
export const getMe = async (): Promise<MeResponse> => {
  const response = await apiClient.get<ApiResponse<MeResponse>>('/api/me');
  return response.data.data;
};

/**
 * 신체정보 조회
 * GET /api/me/profile
 */
export const getProfile = async (): Promise<ProfileResponse | null> => {
  const response = await apiClient.get<ApiResponse<ProfileResponse | null>>('/api/me/profile');
  return response.data.data;
};

/**
 * 부상정보 조회
 * GET /api/me/injuries
 */
export const getInjuries = async (): Promise<InjuriesResponse> => {
  const response = await apiClient.get<ApiResponse<InjuriesResponse>>('/api/me/injuries');
  return response.data.data;
};

/**
 * 알러지 조회
 * GET /api/me/allergies
 */
export const getAllergies = async (): Promise<AllergiesResponse> => {
  const response = await apiClient.get<ApiResponse<AllergiesResponse>>('/api/me/allergies');
  return response.data.data;
};

/**
 * ===========================================
 * 정보 수정 API
 * ===========================================
 */

/**
 * 닉네임 수정
 * PATCH /api/me/nickname
 */
export const updateNickname = async (data: NicknameUpdateRequest): Promise<UserUpdateResponse> => {
  const response = await apiClient.patch<ApiResponse<UserUpdateResponse>>(
    '/api/me/nickname',
    data
  );
  return response.data.data;
};

/**
 * 전화번호 수정
 * PATCH /api/me/phone
 */
export const updatePhoneNumber = async (data: PhoneUpdateRequest): Promise<void> => {
  await apiClient.patch('/api/me/phone', data);
};

/**
 * 프로필 이미지 수정
 * PATCH /api/me/profile-image
 */
export const updateProfileImage = async (data: ProfileImageUpdateRequest): Promise<UserUpdateResponse> => {
  const response = await apiClient.patch<ApiResponse<UserUpdateResponse>>(
    '/api/me/profile-image',
    data
  );
  return response.data.data;
};

/**
 * ===========================================
 * 비밀번호 변경 관련
 * ===========================================
 */

/**
 * 비밀번호 변경
 * PATCH /api/me/password
 */
export const changePassword = async (data: PasswordChangeRequest): Promise<void> => {
  await apiClient.patch('/api/me/password', data);
};

/**
 * ===========================================
 * 회원탈퇴 관련
 * ===========================================
 */

/**
 * 회원탈퇴
 * DELETE /api/me
 */
export const withdrawUser = async (): Promise<void> => {
  await apiClient.delete('/api/me', {
    data: {},
  });
};

/**
 * ===========================================
 * 트레이너 정보 조회 API
 * ===========================================
 */

/**
 * 트레이너 정보 조회
 * GET /api/me/trainer
 */
export const getTrainerInfo = async (): Promise<TrainerInfoResponse> => {
  const response = await apiClient.get<ApiResponse<TrainerInfoResponse>>('/api/me/trainer');
  return response.data.data;
};