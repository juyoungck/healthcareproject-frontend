/**
 * label.ts
 * 라벨 변환 유틸 함수
 */

import type {
  Gender,
  ExperienceLevel,
  GoalType,
  InjuryLevel,
  UserRole,
  AllergyType,
} from '../api/types/me';
import {
  GENDER_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  GOAL_TYPE_LABELS,
  INJURY_LEVEL_LABELS,
  USER_ROLE_LABELS,
  ALLERGY_LABELS,
} from '../constants/me';

/**
 * 성별 라벨 반환
 */
export const getGenderLabel = (gender: Gender | string | undefined): string => {
  if (!gender) return '-';
  return GENDER_LABELS[gender as Gender] ?? '-';
};

/**
 * 운동 경력 라벨 반환
 */
export const getExperienceLevelLabel = (level: ExperienceLevel | string | undefined): string => {
  if (!level) return '-';
  return EXPERIENCE_LEVEL_LABELS[level as ExperienceLevel] ?? '-';
};

/**
 * 운동 목표 라벨 반환
 */
export const getGoalTypeLabel = (goal: GoalType | string | undefined): string => {
  if (!goal) return '-';
  return GOAL_TYPE_LABELS[goal as GoalType] ?? '-';
};

/**
 * 부상 정도 라벨 반환
 */
export const getInjuryLevelLabel = (level: InjuryLevel | string | undefined): string => {
  if (!level) return '-';
  return INJURY_LEVEL_LABELS[level as InjuryLevel] ?? '-';
};

/**
 * 사용자 역할 라벨 반환
 */
export const getUserRoleLabel = (role: UserRole | string | undefined): string => {
  if (!role) return '일반회원';
  return USER_ROLE_LABELS[role as UserRole] ?? '일반회원';
};

/**
 * 알러지 라벨 반환
 */
export const getAllergyLabel = (allergy: AllergyType | string): string => {
  return ALLERGY_LABELS[allergy as AllergyType] ?? allergy;
};

/**
 * 사용자 역할 CSS 클래스 반환
 */
export const getUserRoleClass = (role: string | undefined): string => {
  switch (role) {
    case 'ADMIN': return 'admin';
    case 'TRAINER': return 'trainer';
    default: return 'general';
  }
};

/**
 * 소셜 제공자 한글 이름 반환
 */
export const getSocialProviderLabel = (provider: string): string => {
  switch (provider) {
    case 'KAKAO': return '카카오';
    case 'NAVER': return '네이버';
    case 'GOOGLE': return '구글';
    default: return provider;
  }
};
