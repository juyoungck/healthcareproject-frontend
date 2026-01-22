/**
 * exercise.ts
 * 운동 관련 API 타입 정의
 */

/**
 * 운동 부위 타입
 */
export type BodyPart =
  | 'CHEST'      // 가슴
  | 'BACK'       // 등
  | 'SHOULDER'   // 어깨
  | 'ARM'        // 팔
  | 'LEG'        // 하체
  | 'CORE'       // 코어
  | 'FULL_BODY'; // 전신

/**
 * 난이도 타입
 */
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

/**
 * ===========================================
 * 운동 리스트 조회
 * GET /api/exercises
 * ===========================================
 */

/**
 * 운동 리스트 아이템
 */
export interface ExerciseListItem {
  exerciseId: number;
  name: string;
  bodyPart: BodyPart;
  difficulty: Difficulty; 
  imageUrl: string;
}
/**
 * 운동 리스트 조회 파라미터
 */
export interface ExerciseListParams {
  cursor?: number;
  limit?: number;
  keyword?: string;
  bodyPart?: BodyPart;
}

/**
 * 운동 리스트 조회 응답
 */
export interface ExerciseListResponse {
  items: ExerciseListItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

/**
 * ===========================================
 * 운동 상세조회
 * GET /api/exercises/{exerciseId}
 * ===========================================
 */

/**
 * 운동 상세 정보
 */
export interface ExerciseDetail {
  exerciseId: number;
  name: string;
  imageUrl: string;
  description: string;
  bodyPart: BodyPart;
  difficulty: Difficulty;
  precautions: string;
  youtubeUrl: string;
}

/**
 * 대체 운동 아이템
 */
export interface AlternativeExercise {
  exerciseId: number;
  name: string;
  imageUrl: string;
}

/**
 * 운동 상세조회 응답
 */
export interface ExerciseDetailResponse {
  exercise: ExerciseDetail;
  alternatives: AlternativeExercise[];
}

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