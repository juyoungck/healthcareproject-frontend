/**
 * calendar.ts
 * 캘린더 API 타입 정의
 *
 * API 명세:
 * - GET /api/me/calendar/weekly - 주간 컬러코드
 * - GET /api/calendar/day/{date} - 일일 상세
 * - GET /api/me/workouts/days/{date} - 날짜별 운동 조회
 * - PATCH /api/me/workout-items/{workoutItemId}/check - 운동 체크박스
 * - PATCH /api/diet-meal-items/{dietMealItemId}/check - 식단 체크박스
 */

/**
 * ===========================================
 * 상태 Enum
 * ===========================================
 */

/**
 * 운동/식단 상태
 */
export type WorkoutDietStatus = 'NONE' | 'COMPLETE' | 'INCOMPLETE' | 'FAILED';

/**
 * 화상PT 상태
 */
export type VideoPtStatus = 'NONE' | 'HAS_RESERVATION';

/**
 * 메모 상태
 * TODO: 백엔드 확정 후 변경될 수 있음
 */
export type MemoStatus = 'NONE' | 'HAS_MEMO';

/**
 * ===========================================
 * 주간 컬러코드 API
 * GET /api/me/calendar/weekly?startDate={startDate}
 * ===========================================
 */

/**
 * 일별 상태 (마커 표시용)
 */
export interface DayStatusItem {
  date: string;
  workout: { status: WorkoutDietStatus };
  diet: { status: WorkoutDietStatus };
  videoPt: { status: VideoPtStatus };
  /** TODO: 메모 상태 - 백엔드 확정 후 변경될 수 있음 */
  memo: { status: MemoStatus };
}

/**
 * 주간 컬러코드 응답
 */
export interface WeeklyCalendarResponse {
  startDate: string;
  endDate: string;
  days: DayStatusItem[];
}

/**
 * ===========================================
 * 일일 상세 API
 * GET /api/calendar/day/{date}
 * ===========================================
 */

/**
 * 운동 요약
 */
export interface WorkoutSummary {
  exists: boolean;
  summary: string | null;
  itemsPreview: string[] | null;
}

/**
 * 식단 요약
 */
export interface DietSummary {
  exists: boolean;
  summary: string | null;
}

/**
 * 화상PT 요약
 */
export interface VideoPtSummary {
  exists: boolean;
  summary: string | null;
}

/**
 * 메모 정보
 */
export interface MemoInfo {
  memoId: number | null;
  content: string | null;
}

/**
 * 일일 상세 응답
 */
export interface DailyDetailResponse {
  date: string;
  workout: WorkoutSummary;
  diet: DietSummary;
  videoPt: VideoPtSummary;
  memo: MemoInfo;
}

/**
 * ===========================================
 * 날짜별 운동 조회 API
 * GET /api/me/workouts/days/{date}
 * ===========================================
 */

/**
 * 운동 항목
 */
export interface WorkoutItem {
  workoutItemId: number;
  exerciseId: number;
  name: string;
  quantity: number;
  sets: number;
  restSeconds: number;
  isChecked: boolean;
  sortOrder: number;
}

/**
 * 날짜별 운동 응답
 */
export interface WorkoutDayResponse {
  date: string;
  workoutDayId: number;
  title: string;
  totalMinutes: number;
  exerciseCount: number;
  completedCount: number;
  items: WorkoutItem[];
}

/**
 * ===========================================
 * 운동 체크박스 업데이트 API
 * PATCH /api/me/workout-items/{workoutItemId}/check
 * ===========================================
 */

/**
 * 운동 체크박스 요청
 */
export interface WorkoutCheckRequest {
  checked: boolean;
}

/**
 * 운동 체크박스 응답
 */
export interface WorkoutCheckResponse {
  message: string;
  workoutItemId: number;
  checked: boolean;
}

/**
 * ===========================================
 * 식단 체크박스 업데이트 API
 * PATCH /api/diet-meal-items/{dietMealItemId}/check
 * ===========================================
 */

/**
 * 식단 체크박스 요청
 */
export interface DietCheckRequest {
  checked: boolean;
}

/**
 * 식단 체크박스 응답
 */
export interface DietCheckResponse {
  message: string;
  dietMealItemId: number;
  checked: boolean;
}