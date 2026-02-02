/**
 * exercise.ts
 * 운동 관련 상수 정의
 */

import type { BodyPart, Difficulty } from '../api/types/exercise';

/**
 * ===========================================
 * 라벨 매핑
 * ===========================================
 */

/**
 * 부위 라벨 매핑
 */
export const BODY_PART_LABELS: Record<BodyPart, string> = {
  CHEST: '가슴',
  BACK: '등',
  SHOULDER: '어깨',
  ARM: '팔',
  LEG: '하체',
  CORE: '코어',
  FULL_BODY: '전신',
};

/**
 * 난이도 라벨 매핑
 */
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

/**
 * ===========================================
 * 필터 옵션
 * ===========================================
 */

/**
 * 필터용 부위 옵션 (전체 포함)
 */
export const BODY_PART_OPTIONS: Array<{ value: BodyPart | 'ALL'; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'CHEST', label: '가슴' },
  { value: 'BACK', label: '등' },
  { value: 'SHOULDER', label: '어깨' },
  { value: 'ARM', label: '팔' },
  { value: 'LEG', label: '하체' },
  { value: 'CORE', label: '코어' },
  { value: 'FULL_BODY', label: '전신' },
];

/**
 * 필터용 난이도 옵션 (전체 포함)
 */
export const DIFFICULTY_OPTIONS: Array<{ value: Difficulty | 'ALL'; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
];

/**
 * ===========================================
 * 폼 선택 옵션 (전체 미포함)
 * ===========================================
 */

/**
 * 폼 선택용 부위 옵션
 */
export const BODY_PART_SELECT_OPTIONS: Array<{ value: BodyPart; label: string }> = [
  { value: 'CHEST', label: '가슴' },
  { value: 'BACK', label: '등' },
  { value: 'SHOULDER', label: '어깨' },
  { value: 'ARM', label: '팔' },
  { value: 'LEG', label: '하체' },
  { value: 'CORE', label: '코어' },
  { value: 'FULL_BODY', label: '전신' },
];

/**
 * 폼 선택용 난이도 옵션
 */
export const DIFFICULTY_SELECT_OPTIONS: Array<{ value: Difficulty; label: string }> = [
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
];
