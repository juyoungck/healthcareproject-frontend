/**
 * constants.ts
 * 캘린더 공통 상수 정의
 */

import { Dumbbell, Utensils, Video } from 'lucide-react';
import { CalendarTabType } from '../types/calendar';

/**
 * ===========================================
 * 요일 상수
 * ===========================================
 */

/**
 * 요일 배열 (일요일 시작)
 */
export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * ===========================================
 * 탭 상수
 * ===========================================
 */

/**
 * 캘린더 팝업 탭 데이터
 */
export const CALENDAR_TABS: {
  type: CalendarTabType;
  label: string;
  icon: typeof Dumbbell;
}[] = [
  { type: 'workout', label: '운동', icon: Dumbbell },
  { type: 'diet', label: '식단', icon: Utensils },
  { type: 'pt', label: '화상PT', icon: Video },
];

/**
 * ===========================================
 * 상태 텍스트 상수
 * ===========================================
 */

/**
 * 상태별 표시 텍스트
 */
export const STATUS_TEXT: Record<string, string> = {
  complete: '완료',
  incomplete: '미흡',
  failed: '실패',
  scheduled: '예정',
  none: '없음',
} as const;