/**
 * calendar.ts
 * 캘린더 API 함수
 *
 * API 명세:
 * - GET /api/me/calendar/weekly - 주간 컬러코드
 * - GET /api/calendar/day/{date} - 일일 상세
 */

import apiClient from './client';
import {
  WeeklyCalendarResponse,
  DailyDetailResponse,
} from './types/calendar';

/**
 * ===========================================
 * 주간 컬러코드 조회
 * GET /api/me/calendar/weekly?startDate={startDate}
 * ===========================================
 */
/*
 * 주간/월간 캘린더 상태 조회 (마커 표시용)
 * @param startDate - 시작 날짜 (YYYY-MM-DD)
 * @param endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns 기간 내 상태 정보
 */
export const getWeeklyCalendar = async (
  startDate: string,
  endDate: string
): Promise<WeeklyCalendarResponse> => {
  const response = await apiClient.get<{
    success: boolean;
    data: WeeklyCalendarResponse;
  }>('/api/me/calendar/weekly', { params: { startDate, endDate } });
  return response.data.data;
};

/**
 * ===========================================
 * 일일 상세 조회
 * GET /api/calendar/day/{date}
 * ===========================================
 */

/**
 * 일일 상세 정보 조회 (운동/식단/PT/메모 요약)
 * @param date - 날짜 (YYYY-MM-DD)
 * @returns 일일 상세 정보
 */
export const getDailyDetail = async (
  date: string
): Promise<DailyDetailResponse> => {
  const response = await apiClient.get<{
    success: boolean;
    data: DailyDetailResponse;
  }>(`/api/calendar/day/${date}`);
  return response.data.data;
};