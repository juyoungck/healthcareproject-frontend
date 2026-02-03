/**
 * calendarStatus.ts
 * 캘린더 API 상태값 → CSS 클래스 변환 유틸
 */

import {
  WorkoutDietStatus,
  VideoPtStatus,
} from '../api/types/calendar';

/**
 * ===========================================
 * 날짜 비교 헬퍼
 * ===========================================
 */

/**
 * 오늘 날짜 (시간 제외) 반환
 */
const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * 날짜 문자열을 Date로 변환 (시간 제외)
 * @param dateString - YYYY-MM-DD 형식
 */
const parseDate = (dateString: string): Date => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * ===========================================
 * 운동/식단 상태 변환
 * ===========================================
 */

/**
 * 운동/식단 API 상태 → CSS 클래스 변환
 * - 미래 날짜 + FAILED = 예정 (scheduled)
 * - 과거/오늘 + FAILED = 안함 (failed)
 * @param status - API 응답 상태
 * @param dateString - 해당 날짜 (YYYY-MM-DD)
 * @returns CSS 클래스명
 */
export const getWorkoutDietClass = (
  status: WorkoutDietStatus | undefined,
  dateString: string
): string => {
  if (!status || status === 'NONE') return 'none';

  const today = getToday();
  const targetDate = parseDate(dateString);

  /* 미래 날짜 + FAILED = 예정 */
  if (status === 'FAILED' && targetDate > today) {
    return 'scheduled';
  }

  const statusMap: Record<WorkoutDietStatus, string> = {
    NONE: 'none',
    COMPLETE: 'complete',
    INCOMPLETE: 'incomplete',
    FAILED: 'failed',
  };

  return statusMap[status] || 'none';
};

/**
 * ===========================================
 * 화상PT 상태 변환
 * ===========================================
 */

/**
 * 화상PT API 상태 → CSS 클래스 변환
 * @param status - API 응답 상태
 * @returns CSS 클래스명
 */
export const getVideoPtClass = (status: VideoPtStatus | undefined): string => {
  if (!status) return 'none';

  const statusMap: Record<VideoPtStatus, string> = {
    NONE: 'none',
    HAS_RESERVATION: 'scheduled',
  };

  return statusMap[status] || 'none';
};

/**
 * ===========================================
 * 메모 상태 변환
 * TODO: 백엔드 확정 후 변경될 수 있음
 * ===========================================
 */

/**
 * 메모 API 상태 → CSS 클래스 변환
 * @param status - API 응답 상태
 * @returns CSS 클래스명
 */
export const getMemoClass = (memo: { exists: boolean } | undefined): string => {
  if (!memo) return 'none';
  
  return memo.exists ? 'complete' : 'none';
};