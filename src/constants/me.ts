/**
 * me.ts
 * 마이페이지/온보딩 관련 상수 정의
 */

import type {
  Gender,
  ExperienceLevel,
  GoalType,
  InjuryLevel,
  UserRole,
  AllergyType,
} from '../api/types/me';

/**
 * ===========================================
 * 라벨 매핑
 * ===========================================
 */

/** 성별 라벨 */
export const GENDER_LABELS: Record<Gender, string> = {
  MALE: '남성',
  FEMALE: '여성',
} as const;

/** 운동 경력 라벨 */
export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  BEGINNER: '입문',
  ELEMENTARY: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
} as const;

/** 운동 목표 라벨 */
export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  DIET: '체중 감량',
  BULK: '근력 향상',
  FLEXIBILITY: '유연성',
  MAINTAIN: '체력 향상',
} as const;

/** 부상 정도 라벨 */
export const INJURY_LEVEL_LABELS: Record<InjuryLevel, string> = {
  MILD: '경미',
  CAUTION: '주의 요함',
  SEVERE: '심각',
} as const;

/** 회원 역할 라벨 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  USER: '일반회원',
  TRAINER: '트레이너',
  ADMIN: '관리자',
} as const;

/** 알러지 라벨 */
export const ALLERGY_LABELS: Record<AllergyType, string> = {
  WHEAT: '밀',
  BUCKWHEAT: '메밀',
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
  SOY: '대두',
  SESAME: '참깨',
  SULFITE: '아황산류',
} as const;

/**
 * ===========================================
 * 선택 옵션
 * ===========================================
 */

/** 알러지 옵션 (선택 UI용) */
export const ALLERGY_OPTIONS: { label: string; value: AllergyType }[] = [
  { label: '밀', value: 'WHEAT' },
  { label: '메밀', value: 'BUCKWHEAT' },
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
  { label: '대두', value: 'SOY' },
  { label: '참깨', value: 'SESAME' },
  { label: '아황산류', value: 'SULFITE' },
];

/** 알러지 옵션 (NONE 포함, 식단 계획 생성 UI용) */
export const ALLERGY_OPTIONS_WITH_NONE: { label: string; value: AllergyType | 'NONE' }[] = [
  ...ALLERGY_OPTIONS,
  { label: '없음', value: 'NONE' },
];
