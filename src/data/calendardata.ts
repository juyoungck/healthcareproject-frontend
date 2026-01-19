/**
 * calendarData.ts
 * 캘린더 더미데이터
 * TODO: API 연동 시 삭제
 */

import { DailyStatus } from '../app/components/calendar/WeekCalendar';

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
 * 날짜 키 생성 헬퍼
 */
export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 캘린더 더미데이터 (통합)
 * key: 날짜 문자열 (YYYY-MM-DD)
 * 주간/월간 캘린더 공통 사용
 */
export const calendarDummyData: Record<string, DailyRecord> = {
  '2026-01-06': {
    status: { workout: 'complete', diet: 'complete', pt: 'none', memo: 'complete' },
    workout: {
      bodyPart: '상체',
      exercises: '벤치프레스, 덤벨컬',
      duration: 30,
    },
    diet: {
      mealCount: 3,
      totalCalories: 1800,
    },
    memo: '상체 운동 루틴 완료!',
  },
  '2026-01-07': {
    status: { workout: 'complete', diet: 'none', pt: 'complete', memo: 'none' },
    workout: {
      bodyPart: '하체',
      exercises: '스쿼트',
      duration: 40,
    },
    pt: {
      roomTitle: '다이어트 PT',
      trainerName: '이트레이너',
      duration: 45,
    },
  },
  '2026-01-08': {
    status: { workout: 'none', diet: 'incomplete', pt: 'none', memo: 'complete' },
    diet: {
      mealCount: 2,
      totalCalories: 1200,
    },
    memo: '점심 거름',
  },
  '2026-01-11': {
    status: { workout: 'complete', diet: 'complete', pt: 'complete', memo: 'complete' },
    diet: {
      mealCount: 2,
      totalCalories: 1200,
    },
     workout: {
      bodyPart: '상체',
      exercises: '벤치프레스, 덤벨컬',
      duration: 30,
     }
    
  },
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
    status: { workout: 'incomplete', diet: 'complete', pt: 'failed', memo: 'none' },
    workout: {
      bodyPart: '전신',
      exercises: '버피, 마운틴클라이머',
      duration: 25,
    },
    diet: {
      mealCount: 3,
      totalCalories: 2000,
    },
  },
  '2026-01-14': {
    status: { workout: 'complete', diet: 'incomplete', pt: 'complete', memo: 'none' },
    workout: {
      bodyPart: '하체',
      exercises: '스쿼트, 런지',
      duration: 45,
    },
    diet: {
      mealCount: 2,
      totalCalories: 1500,
    },
    pt: {
      roomTitle: '초보자 PT',
      trainerName: '김트레이너',
      duration: 60,
    },
  },
  '2026-01-15': {
    status: { workout: 'failed', diet: 'failed', pt: 'failed', memo: 'complete' },
    memo: '몸살로 운동 실패',
  },
  '2026-01-16': {
    status: { workout: 'none', diet: 'complete', pt: 'none', memo: 'none' },
    diet: {
      mealCount: 3,
      totalCalories: 1900,
    },
  },
};