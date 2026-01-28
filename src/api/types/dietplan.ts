/**
 * diet.ts
 * 식단 계획 조회/체크 관련 타입 정의
 */

/**
 * ===========================================
 * 날짜별 식단 조회 관련
 * GET /api/me/diets/days/{date}
 * ===========================================
 */

/**
 * 식단 음식 항목
 */
export interface DietMealItem {
  dietMealItemId: number;
  foodId: number;
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  isChecked: boolean;
}

/**
 * 식단 끼니
 */
export interface DietMeal {
  dietMealId: number;
  sortOrder: number;
  items: DietMealItem[];
}

/**
 * 날짜별 식단 조회 응답
 */
export interface DailyDietResponse {
  date: string;
  dietDayId: number;
  meals: DietMeal[];
}

/**
 * ===========================================
 * 식단 체크 업데이트 관련
 * PATCH /api/diet-meal-items/{dietMealItemId}/check
 * ===========================================
 */

/**
 * 식단 체크 요청
 */
export interface DietCheckRequest {
  checked: boolean;
}

/**
 * 식단 체크 응답
 */
export interface DietCheckResponse {
  message: string;
  dietMealItemId: number;
  checked: boolean;
}