/**
 * me.ts
 * 마이페이지/온보딩 관련 타입 정의
 */

/**
 * ===========================================
 * 공통 타입
 * ===========================================
 */

/** 성별 */
export type Gender = 'MALE' | 'FEMALE';

/** 운동 경력 */
export type ExperienceLevel = 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED';

/** 운동 목표 */
export type GoalType = 'DIET' | 'BULK' | 'FLEXIBILITY' |'MAINTAIN';

/** 부상 정도 */
export type InjuryLevel = 'MILD' | 'CAUTION' | 'SEVERE';

/** 회원 역할 */
export type UserRole = 'USER' | 'TRAINER' | 'ADMIN';

/** 회원 상태 */
export type UserStatus = 'ACTIVE' | 'WITHDRAWN';

/**
 * ===========================================
 * 온보딩 관련
 * ===========================================
 */

/**
 * 온보딩 프로필 정보
 */
export interface OnboardingProfile {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: Gender;
  experienceLevel: ExperienceLevel;
  goalType: GoalType;
  weeklyDays: number;
  sessionMinutes: number;
}

/**
 * 온보딩 부상 정보
 */
export interface OnboardingInjury {
  injuryPart: string;
  injuryLevel: InjuryLevel;
}

/**
 * 온보딩 저장 요청
 * PUT /api/me/onboarding
 */
export interface OnboardingRequest {
  profile: OnboardingProfile;
  injuries: OnboardingInjury[];
  allergies: string[];
}

/**
 * 온보딩 완료여부 응답
 * GET /api/me/onboarding/status
 */
export interface OnboardingStatusResponse {
  completed: boolean;
}

/**
 * ===========================================
 * 내 정보 조회 관련
 * ===========================================
 */

/**
 * 내 기본정보 응답
 * GET /api/me
 */
export interface MeResponse {
  email: string;
  handle: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  profileImageUrl: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 신체정보 응답
 * GET /api/me/profile
 */
export interface ProfileResponse {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: Gender;
  experienceLevel: ExperienceLevel;
  goalType: GoalType;
  weeklyDays: number;
  sessionMinutes: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 부상 정보 아이템
 */
export interface InjuryItem {
  injuryId: number;
  injuryPart: string;
  injuryLevel: InjuryLevel;
  createdAt: string;
  updatedAt: string;
}

/**
 * 부상정보 응답
 * GET /api/me/injuries
 */
export interface InjuriesResponse {
  injuries: InjuryItem[];
}

/**
 * 알러지 응답
 * GET /api/me/allergies
 */
export interface AllergiesResponse {
  count: number;
  allergies: string[];
}

/**
 * ===========================================
 * 정보 수정 관련
 * ===========================================
 */

/**
 * 닉네임 수정 요청
 * PATCH /api/me/nickname
 */
export interface NicknameUpdateRequest {
  nickname: string;
}

/**
 * 전화번호 수정 요청
 * PATCH /api/me/phone
 */
export interface PhoneUpdateRequest {
  phoneNumber: string;
}

/**
 * 프로필 이미지 수정 요청
 * PATCH /api/me/profile-image
 */
export interface ProfileImageUpdateRequest {
  profileImageUrl: string;
}

/**
 * 회원정보 수정 응답 (공통)
 */
export interface UserUpdateResponse {
  user: {
    userId: number;
    email: string;
    nickname: string;
    role: UserRole;
    status: UserStatus;
    profileImageUrl: string | null;
    phoneNumber: string | null;
    updatedAt: string;
  };
}

/**
 * ===========================================
 * 비밀번호 변경 관련
 * ===========================================
 */

/**
 * 비밀번호 변경 요청
 * PATCH /api/me/password
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * ===========================================
 * 회원탈퇴 관련
 * ===========================================
 */

/**
 * 회원탈퇴 요청
 * DELETE /api/me
 */

/* 특정 문구 확인 방식으로 body가 필요 없어짐.
export interface WithdrawRequest {
  password: string;
}
*/

/**
 * ===========================================
 * 트레이너 정보 조회 관련
 * ===========================================
 */

/** 트레이너 신청 상태 */
export type TrainerApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * 트레이너 정보 응답
 * GET /api/me/trainer
 */
export interface TrainerInfoResponse {
  applicationStatus: TrainerApplicationStatus;
  licenseUrlsJson: string[];
  bio: string | null;
  rejectReason: string | null;
  approvedAt: string | null;
}
