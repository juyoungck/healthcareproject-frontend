/**
 * utils.ts
 * 캘린더 공통 유틸 함수
 */

import { STATUS_TEXT } from '../constants/calendar';

/**
 * ===========================================
 * 날짜 키 변환
 * ===========================================
 */

/**
 * Date 객체를 날짜 키 문자열로 변환
 * @param date - Date 객체
 * @returns YYYY-MM-DD 형식 문자열
 */
export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * ===========================================
 * 날짜 비교
 * ===========================================
 */

/**
 * 두 날짜가 같은 날인지 비교
 * @param date1 - 비교할 첫 번째 날짜
 * @param date2 - 비교할 두 번째 날짜
 * @returns 같은 날이면 true
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 오늘 날짜인지 확인
 * @param date - 확인할 날짜
 * @returns 오늘이면 true
 */
export const isToday = (date: Date): boolean => {
  return isSameDate(date, new Date());
};

/**
 * ===========================================
 * 날짜 포맷팅
 * ===========================================
 */

/**
 * 날짜를 "M월 D일 (요일)" 형식으로 변환
 * @param date - Date 객체
 * @returns 포맷된 문자열
 */
export const formatDateShort = (date: Date): string => {
  const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEK_DAYS[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
};

/**
 * 날짜를 "YYYY년 M월 D일 (요일)" 형식으로 변환
 * @param date - Date 객체
 * @returns 포맷된 문자열
 */
export const formatDateFull = (date: Date): string => {
  const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEK_DAYS[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

/**
 * ===========================================
 * 상태 텍스트 변환
 * ===========================================
 */

/**
 * 상태 코드를 한글 텍스트로 변환
 * @param status - 상태 코드
 * @returns 한글 상태 텍스트
 */
export const getStatusText = (status: string): string => {
  return STATUS_TEXT[status] || '없음';
};

/**
 * ===========================================
 * 주간 캘린더 유틸
 * ===========================================
 */

/**
 * 특정 날짜가 속한 주의 일요일 반환
 * @param date - 기준 날짜
 * @returns 해당 주 일요일 Date 객체
 */
export const getWeekStartDate = (date: Date): Date => {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  result.setDate(result.getDate() - dayOfWeek);
  return result;
};

/**
 * 주 시작일 기준 7일 배열 반환
 * @param weekStartDate - 주 시작일 (일요일)
 * @returns 7일 Date 배열
 */
export const getWeekDates = (weekStartDate: Date): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

/**
 * 주차 정보 반환 (예: "1월 2주차")
 * @param weekStartDate - 주 시작일
 * @returns 주차 문자열
 */
export const getWeekOfMonth = (weekStartDate: Date): string => {
  const wednesday = new Date(weekStartDate);
  wednesday.setDate(weekStartDate.getDate() + 3);

  const month = wednesday.getMonth() + 1;
  const firstDayOfMonth = new Date(wednesday.getFullYear(), wednesday.getMonth(), 1);
  const firstDayWeek = firstDayOfMonth.getDay();
  const weekNumber = Math.ceil((wednesday.getDate() + firstDayWeek) / 7);

  return `${month}월 ${weekNumber}주차`;
};

/**
 * ===========================================
 * 월간 캘린더 유틸
 * ===========================================
 */

/**
 * 해당 월의 달력 데이터 생성 (6주 42일)
 * @param currentDate - 현재 표시 중인 년/월
 * @returns 날짜 배열 (이전달/현재달/다음달 포함)
 */
export const generateCalendarDays = (
  currentDate: Date
): { date: Date; isCurrentMonth: boolean }[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const prevLastDay = new Date(year, month, 0).getDate();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  /* 이전 달 날짜 채우기 */
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevLastDay - i),
      isCurrentMonth: false,
    });
  }

  /* 현재 달 날짜 채우기 */
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  /* 다음 달 날짜 채우기 (6주 맞추기) */
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return days;
};