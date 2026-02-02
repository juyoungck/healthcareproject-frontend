/**
 * onboarding.ts
 * 온보딩 관련 상수 정의
 */

import type { OnboardingData, OnboardingStep } from '../api/types/onboarding';

/**
 * 온보딩 단계 목록
 */
export const ONBOARDING_STEPS: OnboardingStep[] = ['body', 'exercise', 'injury', 'schedule', 'confirm'];

/**
 * 초기 데이터
 */
export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  heightCm: '',
  weightKg: '',
  age: '',
  gender: null,
  allergies: [],
  experienceLevel: null,
  goalType: null,
  hasInjury: false,
  injuries: [],
  weeklyDays: 3,
  sessionMinutes: null
};

/**
 * 운동 경력 옵션
 */
export const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: '입문', desc: '운동 경험 없음' },
  { value: 'elementary', label: '초급', desc: '1년 미만' },
  { value: 'intermediate', label: '중급', desc: '1~3년' },
  { value: 'advanced', label: '고급', desc: '3년 이상' }
] as const;

/**
 * 운동 목표 옵션
 */
export const GOAL_OPTIONS = [
  { value: 'strength', label: '근력 향상', desc: '근육량 증가' },
  { value: 'weight_loss', label: '체중 감량', desc: '다이어트' },
  { value: 'flexibility', label: '유연성', desc: '스트레칭' },
  { value: 'endurance', label: '체력 향상', desc: '지구력 강화' }
] as const;

/**
 * 부상 정도 옵션
 */
export const INJURY_SEVERITY_OPTIONS = [
  { value: 'mild', label: '경미' },
  { value: 'caution', label: '주의 요함' },
  { value: 'severe', label: '심각' }
] as const;

/**
 * 운동 시간 옵션
 */
export const SESSION_TIME_OPTIONS = [
  { value: '30min', label: '30분 이내' },
  { value: '1hour', label: '1시간' },
  { value: '1hour30', label: '1시간 30분' },
  { value: '2hour', label: '2시간 이상' }
] as const;

/**
 * 단계별 제목
 */
export const STEP_TITLES: Record<OnboardingStep, string> = {
  body: '신체 정보',
  exercise: '운동 경력',
  injury: '부상 이력',
  schedule: '운동 주기',
  confirm: '정보 확인'
};
