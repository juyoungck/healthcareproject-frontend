/**
 * ai.ts
 * AI 운동/식단 계획 생성 API 타입 정의
 */

/* ===========================================
 * 운동 AI API 타입
 * =========================================== */

/**
 * 운동 루틴 생성 요청
 * PUT /api/workouts/ai/routines
 */
export interface WorkoutAiRequest {
  dates: string[];           /* ISO 날짜 문자열 배열 (예: ["2026-01-17", "2026-01-19"]) */
  additionalRequest?: string | null;  /* 추가 요청사항 (nullable) */
}

/**
 * 운동 루틴 생성 응답
 */
export interface WorkoutAiResponse {
  generatedAt: string;       /* 생성 시각 (ISO datetime) */
  planSummary: {
    rangeDays: number;       /* 전체 기간 (일) */
    workoutDayCount: number; /* 운동일 수 */
  };
  considerations: string[];  /* AI가 고려한 사항들 */
  days: WorkoutDay[];        /* 날짜별 운동 계획 */
}

/**
 * 운동일 정보
 */
export interface WorkoutDay {
  workoutDayId: number;
  logDate: string;           /* ISO 날짜 (예: "2026-01-17") */
  dayOfWeek: string;         /* 요일 (예: "SAT") */
  title: string;             /* 운동 제목 (예: "등/이두") */
  totalMinutes: number;      /* 총 운동 시간 */
  items: WorkoutItem[];      /* 운동 항목들 */
}

/**
 * 운동 항목 정보
 */
export interface WorkoutItem {
  workoutItemId: number;
  displayOrder: number;
  exerciseId: number;
  exerciseName: string;
  sets: number | null;
  reps: number | null;
  restSecond: number | null;
  durationMinutes: number | null;
  distanceKm: number | null;
  rpe: number | null;
  amount: string | null;
  isChecked: boolean;
}

/* ===========================================
 * 식단 AI API 타입
 * =========================================== */

/**
 * 식단 계획 생성 요청
 * PUT /api/diets/ai/week-plans
 */
export interface DietAiRequest {
  allergies: string[];       /* 알레르기 enum 배열 (예: ["PEANUT", "MILK"]) */
  note?: string | null;      /* 추가 요청사항 (nullable) */
}

/**
 * 식단 계획 생성 응답
 */
export interface DietAiResponse {
  startDate: string;         /* 시작일 (ISO 날짜) */
  endDate: string;           /* 종료일 (ISO 날짜) */
  considerations?: string[]; /* AI가 고려한 사항들 (추후 추가 예정) */
  days: DietDay[];           /* 날짜별 식단 */
  pageInfo: {
    days: number;            /* 총 일수 (7) */
  };
}

/**
 * 식단일 정보
 */
export interface DietDay {
  dietDayId: number;
  logDate: string;           /* ISO 날짜 */
  summary: {
    totalCalories: number;
    mealCount: number;
  };
  meals: DietMeal[];         /* 끼니별 정보 */
}

/**
 * 끼니 정보
 */
export interface DietMeal {
  dietMealId: number;
  displayOrder: number;
  isChecked: boolean;
  title: string;             /* 끼니 제목 (예: "아보카도 토스트 + 포치드 에그") */
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  items: DietMealItem[];     /* 음식 항목들 */
}

/**
 * 식단 항목 정보
 */
export interface DietMealItem {
  dietMealItemId: number;
  foodId: number;
  name: string;
  imageUrl: string | null;
  nutritionUnit: string;     /* 단위 (예: "G") */
  nutritionAmount: number;
  grams: number;
  count: number;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  isChecked: boolean;
}