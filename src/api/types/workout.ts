/**
 * workout.ts
 * 운동 계획 조회/체크 관련 타입 정의
 */

/**
 * ===========================================
 * 날짜별 운동 조회 관련
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
  restSeconds: number;
  amount: String;
  rpe: number;
  isChecked: boolean;
  sortOrder: number;
}

/**
 * 날짜별 운동 조회 응답
 */
export interface DailyWorkoutResponse {
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
 * 운동 체크 업데이트 관련
 * PATCH /api/me/workout-items/{workoutItemId}/check
 * ===========================================
 */

/**
 * 운동 체크 요청
 */
export interface WorkoutCheckRequest {
  checked: boolean;
}

/**
 * 운동 체크 응답
 */
export interface WorkoutCheckResponse {
  message: string;
  workoutItemId: number;
  checked: boolean;
}