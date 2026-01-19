/**
 * types.ts
 * 캘린더 공통 타입 정의
 */

/**
 * ===========================================
 * 상태 타입
 * ===========================================
 */

/**
 * 활동 상태 타입
 * - none: 기록 없음
 * - scheduled: 예정
 * - failed: 실패
 * - incomplete: 미흡
 * - complete: 완료
 */
export type StatusType = 'none' | 'scheduled' | 'failed' | 'incomplete' | 'complete';

/**
 * 일일 상태 타입
 */
export interface DailyStatus {
  workout: StatusType;
  diet: StatusType;
  pt: StatusType;
  memo: StatusType;
}

/**
 * ===========================================
 * 기록 타입
 * ===========================================
 */

/**
 * 운동 기록 타입
 */
export interface WorkoutRecord {
  bodyPart: string;
  exercises: string;
  duration: number;
}

/**
 * 식단 기록 타입
 */
export interface DietRecord {
  mealCount: number;
  totalCalories: number;
}

/**
 * 화상PT 기록 타입
 */
export interface PTRecord {
  roomTitle: string;
  trainerName: string;
  duration: number;
}

/**
 * 일일 기록 타입
 */
export interface DailyRecord {
  status: DailyStatus;
  workout?: WorkoutRecord;
  diet?: DietRecord;
  pt?: PTRecord;
  memo?: string;
}

/**
 * ===========================================
 * 탭 타입
 * ===========================================
 */

/**
 * 캘린더 팝업 탭 타입
 */
export type CalendarTabType = 'workout' | 'diet' | 'pt';