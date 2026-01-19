/**
 * calendarData.ts
 * 캘린더 더미데이터
 * TODO: API 연동 시 삭제
 */

import { DailyRecord } from '../types/calendar';

/**
 * ===========================================
 * 캘린더 더미데이터
 * ===========================================
 */

/**
 * 캘린더 더미데이터
 * key: 날짜 문자열 (YYYY-MM-DD)
 * 주간/월간 캘린더 공통 사용
 */
export const calendarDummyData: Record<string, DailyRecord> = {
  /**
   * 저번 주 (1/12 ~ 1/18)
   */
  '2026-01-12': {
    status: { workout: 'complete', diet: 'complete', pt: 'none', memo: 'none' },
    workout: {
      bodyPart: '상체',
      exercises: '벤치프레스, 덤벨컬',
      duration: 30,
    },
    diet: {
      mealCount: 3,
      totalCalories: 1800,
    },
  },
  '2026-01-13': {
    status: { workout: 'complete', diet: 'incomplete', pt: 'none', memo: 'complete' },
    workout: {
      bodyPart: '하체',
      exercises: '스쿼트, 런지',
      duration: 45,
    },
    diet: {
      mealCount: 2,
      totalCalories: 1400,
    },
    memo: '점심 거름',
  },
  '2026-01-14': {
    status: { workout: 'none', diet: 'complete', pt: 'complete', memo: 'none' },
    diet: {
      mealCount: 3,
      totalCalories: 2000,
    },
    pt: {
      roomTitle: '다이어트 PT',
      trainerName: '이트레이너',
      duration: 45,
    },
  },
  '2026-01-15': {
    status: { workout: 'complete', diet: 'complete', pt: 'none', memo: 'none' },
    workout: {
      bodyPart: '전신',
      exercises: '버피, 마운틴클라이머',
      duration: 30,
    },
    diet: {
      mealCount: 3,
      totalCalories: 1900,
    },
  },
  '2026-01-16': {
    status: { workout: 'incomplete', diet: 'complete', pt: 'none', memo: 'complete' },
    workout: {
      bodyPart: '상체',
      exercises: '푸쉬업',
      duration: 15,
    },
    diet: {
      mealCount: 3,
      totalCalories: 1850,
    },
    memo: '컨디션 저조로 운동 일찍 마무리',
  },
  '2026-01-17': {
    status: { workout: 'failed', diet: 'failed', pt: 'none', memo: 'complete' },
    memo: '몸살로 운동/식단 실패',
  },
  '2026-01-18': {
    status: { workout: 'none', diet: 'complete', pt: 'none', memo: 'none' },
    diet: {
      mealCount: 3,
      totalCalories: 1700,
    },
  },

  /**
   * 이번 주 (1/19 ~ 1/25)
   */
  '2026-01-19': {
    status: { workout: 'scheduled', diet: 'scheduled', pt: 'none', memo: 'none' },
  },
  '2026-01-20': {
    status: { workout: 'scheduled', diet: 'scheduled', pt: 'scheduled', memo: 'none' },
    pt: {
      roomTitle: '초보자 PT',
      trainerName: '김트레이너',
      duration: 60,
    },
  },
  '2026-01-21': {
    status: { workout: 'scheduled', diet: 'scheduled', pt: 'none', memo: 'none' },
  },
  '2026-01-22': {
    status: { workout: 'none', diet: 'scheduled', pt: 'none', memo: 'none' },
  },
  '2026-01-23': {
    status: { workout: 'scheduled', diet: 'scheduled', pt: 'none', memo: 'none' },
  },
  '2026-01-24': {
    status: { workout: 'scheduled', diet: 'scheduled', pt: 'scheduled', memo: 'none' },
    pt: {
      roomTitle: '근력 강화 PT',
      trainerName: '박트레이너',
      duration: 50,
    },
  },
  '2026-01-25': {
    status: { workout: 'none', diet: 'scheduled', pt: 'none', memo: 'none' },
  },
};