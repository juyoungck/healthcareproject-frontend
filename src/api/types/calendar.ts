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
 * 프론트엔드 상태 타입 (UI용)
 * ===========================================
 */

/**
 * 활동 상태 타입 (UI 표시용)
 * - none: 기록 없음
 * - scheduled: 예정
 * - failed: 실패
 * - incomplete: 미흡
 * - complete: 완료
 */
export type StatusType = 'none' | 'scheduled' | 'failed' | 'incomplete' | 'complete';

/**
 * 일일 상태 타입 (UI 표시용)
 */
export interface DailyStatus {
  workout: StatusType;
  diet: StatusType;
  pt: StatusType;
  memo: StatusType;
}

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
 * 운동/식단 날짜별 상태
 */
export type DayStatus = 'DONE' | 'PLANNED' | 'NO_STATUS';

/**
 * 운동/식단 날짜별 상태 항목 (주간 상태 API용)
 */
export interface WeeklyDayStatusItem {
  date: string;
  status: DayStatus;
}

/**
 * 운동/식단 주간 상태 API 응답
 */
export interface WeeklyStatusResponse {
  startDate: string;
  endDate: string;
  days: WeeklyDayStatusItem[];
}

/**
 * 날짜를 key로 변환한 맵 (컴포넌트에서 사용)
 */
export type WeeklyStatusMap = {
  [date: string]: DayStatus;
};

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
  memo: {
  exists: boolean;
};
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
