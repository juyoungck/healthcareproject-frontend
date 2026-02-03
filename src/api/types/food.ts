/**
 * food.ts
 * 음식 관련 API 타입 정의
 */

/**
 * ===========================================
 * 음식 리스트 조회
 * GET /api/foods
 * ===========================================
 */

/**
 * 음식 리스트 아이템
 */
export interface FoodListItem {
  foodId: number;
  name: string;
  imageUrl: string;
  allergies: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
}

/**
 * 음식 리스트 조회 파라미터
 */
export interface FoodListParams {
  cursor?: number;
  limit?: number;
  keyword?: string;
}

/**
 * 음식 리스트 조회 응답
 */
export interface FoodListResponse {
  items: FoodListItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

/**
 * ===========================================
 * 음식 상세조회
 * GET /api/foods/{foodId}
 * ===========================================
 */

/**
 * 음식 상세 정보
 */
export interface FoodDetail {
  foodId: number;
  name: string;
  imageUrl: string;
  allergies: string;
  calories: number;
  nutritionUnit: string;
  nutritionAmount: number;
  carbs: number;
  proteins: number;
  fats: number;
}