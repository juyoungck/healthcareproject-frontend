/**
 * foods.ts
 * 음식 데이터 및 타입 정의
 * TODO: API 연동 시 DUMMY_FOODS 제거
 */

/**
 * 단위 타입 정의 (고체: g, 액체: ml)
 */
export type UnitType = 'g' | 'ml';

/**
 * 음식 데이터 타입
 */
export interface FoodItem {
  id: string;
  name: string;
  image: string;
  unit: UnitType;
  calories: number;
  nutrients: {
    carb: number;
    protein: number;
    fat: number;
  };
}

/**
 * 더미 음식 데이터
 * TODO: API 연동 시 이 데이터를 API 응답으로 대체
 */
export const DUMMY_FOODS: FoodItem[] = [
  { 
    id: '1', 
    name: '닭가슴살', 
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 165,
    nutrients: { carb: 0, protein: 31, fat: 3.6 }
  },
  { 
    id: '2', 
    name: '현미밥', 
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 216,
    nutrients: { carb: 45, protein: 5, fat: 1.8 }
  },
  { 
    id: '3', 
    name: '브로콜리', 
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 55,
    nutrients: { carb: 11, protein: 3.7, fat: 0.6 }
  },
  { 
    id: '4', 
    name: '연어', 
    image: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 208,
    nutrients: { carb: 0, protein: 20, fat: 13 }
  },
  { 
    id: '5', 
    name: '바나나', 
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 89,
    nutrients: { carb: 23, protein: 1.1, fat: 0.3 }
  },
  { 
    id: '6', 
    name: '소고기', 
    image: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 250,
    nutrients: { carb: 0, protein: 26, fat: 15 }
  },
  { 
    id: '7', 
    name: '아보카도', 
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 160,
    nutrients: { carb: 9, protein: 2, fat: 15 }
  },
  { 
    id: '8', 
    name: '고구마', 
    image: 'https://images.unsplash.com/photo-1596097635121-14b63a7a6c14?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 103,
    nutrients: { carb: 24, protein: 2.3, fat: 0.1 }
  },
  { 
    id: '9', 
    name: '시금치', 
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 23,
    nutrients: { carb: 3.6, protein: 2.9, fat: 0.4 }
  },
  { 
    id: '10', 
    name: '사과', 
    image: 'https://images.unsplash.com/photo-1584306812952-4eb5c6a32d45?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 52,
    nutrients: { carb: 14, protein: 0.3, fat: 0.2 }
  },
  { 
    id: '11', 
    name: '계란', 
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 155,
    nutrients: { carb: 1.1, protein: 13, fat: 11 }
  },
  { 
    id: '12', 
    name: '돼지고기', 
    image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200&h=200&fit=crop', 
    unit: 'g',
    calories: 242,
    nutrients: { carb: 0, protein: 27, fat: 14 }
  },
  { 
    id: '13', 
    name: '우유', 
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop', 
    unit: 'ml',
    calories: 60,
    nutrients: { carb: 5, protein: 3.2, fat: 3.2 }
  },
  { 
    id: '14', 
    name: '오렌지주스', 
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop', 
    unit: 'ml',
    calories: 45,
    nutrients: { carb: 10, protein: 0.7, fat: 0.2 }
  },
];