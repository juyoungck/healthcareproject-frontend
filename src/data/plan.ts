/**
 * plan.ts
 * 운동/식단 계획 더미 데이터
 * TODO: AI API 연동 시 이 파일 삭제 필요
 */

import { ExercisePlan } from '../app/components/plan/PlanExerciseResult';
import { DietPlan } from '../app/components/plan/PlanDietResult';
import { DietGoal } from '../app/components/plan/PlanDietCreate';

/**
 * 요일별 운동 카테고리 및 운동 목록
 */
const DAY_CATEGORIES: { [key: number]: { category: string; exercises: { name: string; sets: number; reps: number; rest: number }[] } } = {
  0: {
    category: '휴식 또는 유산소',
    exercises: [
      { name: '가벼운 조깅', sets: 1, reps: 30, rest: 0 },
      { name: '스트레칭', sets: 1, reps: 15, rest: 0 },
    ]
  },
  1: {
    category: '상체 근력',
    exercises: [
      { name: '벤치프레스', sets: 3, reps: 12, rest: 90 },
      { name: '덤벨 숄더프레스', sets: 3, reps: 12, rest: 60 },
      { name: '케이블 플라이', sets: 3, reps: 15, rest: 60 },
      { name: '트라이셉 딥스', sets: 3, reps: 12, rest: 60 },
    ]
  },
  2: {
    category: '하체 근력',
    exercises: [
      { name: '바벨 스쿼트', sets: 4, reps: 10, rest: 120 },
      { name: '레그프레스', sets: 3, reps: 12, rest: 90 },
      { name: '레그컬', sets: 3, reps: 15, rest: 60 },
      { name: '카프레이즈', sets: 3, reps: 20, rest: 45 },
    ]
  },
  3: {
    category: '등/이두',
    exercises: [
      { name: '랫풀다운', sets: 3, reps: 12, rest: 60 },
      { name: '시티드 로우', sets: 3, reps: 12, rest: 60 },
      { name: '덤벨 로우', sets: 3, reps: 12, rest: 60 },
      { name: '바이셉 컬', sets: 3, reps: 15, rest: 45 },
    ]
  },
  4: {
    category: '어깨/코어',
    exercises: [
      { name: '오버헤드프레스', sets: 3, reps: 10, rest: 90 },
      { name: '사이드 레터럴 레이즈', sets: 3, reps: 15, rest: 45 },
      { name: '플랭크', sets: 3, reps: 60, rest: 30 },
      { name: '크런치', sets: 3, reps: 20, rest: 30 },
    ]
  },
  5: {
    category: '전신 유산소',
    exercises: [
      { name: '버피', sets: 4, reps: 10, rest: 60 },
      { name: '마운틴 클라이머', sets: 3, reps: 20, rest: 45 },
      { name: '점프 스쿼트', sets: 3, reps: 15, rest: 45 },
      { name: '하이니 런', sets: 3, reps: 30, rest: 30 },
    ]
  },
  6: {
    category: '활동적 휴식',
    exercises: [
      { name: '요가', sets: 1, reps: 30, rest: 0 },
      { name: '폼롤러 릴리즈', sets: 1, reps: 15, rest: 0 },
    ]
  },
};

/**
 * 더미 운동 계획 생성 함수
 * TODO: 실제 AI API 연동 시 대체
 */
export const generateDummyExercisePlan = (selectedDays: number[]): ExercisePlan => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;

  const dailyPlans = selectedDays.map((dayId, index) => {
    const dayData = DAY_CATEGORIES[dayId] || DAY_CATEGORIES[1];
    return {
      dayName: String(dayId),
      category: dayData.category,
      totalMinutes: 45 + (index % 3) * 15,
      exercises: dayData.exercises.map((ex, idx) => ({
        id: dayId * 10 + idx,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        restSeconds: ex.rest,
      })),
    };
  });

  return {
    createdAt: `${dateStr} 생성`,
    duration: '1주',
    daysPerWeek: selectedDays.length,
    considerations: [
      '부상 이력(무릎)을 고려하여 무릎에 부담이 적은 운동으로 구성했습니다.',
      '초급 수준을 고려하여 무게보다는 정확한 자세에 집중하세요.',
      '체중 감량 목표를 위해 금요일에 유산소 운동을 포함했습니다.',
    ],
    dailyPlans,
  };
};

/**
 * ===========================================
 * 식단 계획 더미 데이터
 * ===========================================
 */

/**
 * 목표별 칼로리 설정
 */
const GOAL_CALORIES: { [key in DietGoal]: number } = {
  bulk: 2500,
  diet: 1800,
  maintain: 2100,
};

/**
 * 목표별 영양소 비율
 */
const GOAL_MACROS: { [key in DietGoal]: { carb: number; protein: number; fat: number } } = {
  bulk: { carb: 50, protein: 30, fat: 20 },
  diet: { carb: 45, protein: 30, fat: 25 },
  maintain: { carb: 50, protein: 25, fat: 25 },
};

/**
 * 끼니 타입
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';

/**
 * 끼니 타입 라벨
 */
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack1: '간식',
  snack2: '간식2',
};

/**
 * 요일별 식단 데이터 (메뉴 개별 분리)
 */
const DAILY_MEALS_DATA = [
  {
    dayId: 1,
    meals: [
      { type: 'breakfast', typeLabel: '아침', menu: '오트밀', calories: 200, carb: 35, protein: 6, fat: 5 },
      { type: 'breakfast', typeLabel: '아침', menu: '바나나', calories: 100, carb: 25, protein: 1, fat: 0 },
      { type: 'breakfast', typeLabel: '아침', menu: '아몬드', calories: 150, carb: 5, protein: 5, fat: 10 },
      { type: 'lunch', typeLabel: '점심', menu: '현미밥', calories: 300, carb: 60, protein: 5, fat: 2 },
      { type: 'lunch', typeLabel: '점심', menu: '닭가슴살 샐러드', calories: 300, carb: 10, protein: 40, fat: 8 },
      { type: 'dinner', typeLabel: '저녁', menu: '연어구이', calories: 350, carb: 5, protein: 40, fat: 18 },
      { type: 'dinner', typeLabel: '저녁', menu: '브로콜리', calories: 200, carb: 35, protein: 10, fat: 2 },
      { type: 'snack1', typeLabel: '간식', menu: '그릭요거트', calories: 130, carb: 15, protein: 12, fat: 3 },
      { type: 'snack1', typeLabel: '간식', menu: '블루베리', calories: 70, carb: 10, protein: 3, fat: 2 },
    ]
  },
  {
    dayId: 2,
    meals: [
      { type: 'breakfast', typeLabel: '아침', menu: '통밀토스트', calories: 280, carb: 35, protein: 10, fat: 8 },
      { type: 'breakfast', typeLabel: '아침', menu: '스크램블 에그', calories: 200, carb: 10, protein: 15, fat: 12 },
      { type: 'lunch', typeLabel: '점심', menu: '퀴노아 볼', calories: 350, carb: 45, protein: 15, fat: 10 },
      { type: 'lunch', typeLabel: '점심', menu: '두부 스테이크', calories: 230, carb: 15, protein: 20, fat: 8 },
      { type: 'dinner', typeLabel: '저녁', menu: '소고기 스테이크', calories: 420, carb: 10, protein: 38, fat: 22 },
      { type: 'dinner', typeLabel: '저녁', menu: '고구마', calories: 200, carb: 40, protein: 10, fat: 0 },
      { type: 'snack1', typeLabel: '간식', menu: '프로틴 쉐이크', calories: 170, carb: 10, protein: 30, fat: 3 },
    ]
  },
  {
    dayId: 3,
    meals: [
      { type: 'breakfast', typeLabel: '아침', menu: '그래놀라', calories: 250, carb: 40, protein: 8, fat: 7 },
      { type: 'breakfast', typeLabel: '아침', menu: '우유', calories: 120, carb: 12, protein: 6, fat: 5 },
      { type: 'breakfast', typeLabel: '아침', menu: '딸기', calories: 50, carb: 8, protein: 1, fat: 0 },
      { type: 'lunch', typeLabel: '점심', menu: '잡곡밥', calories: 350, carb: 65, protein: 8, fat: 3 },
      { type: 'lunch', typeLabel: '점심', menu: '제육볶음', calories: 300, carb: 10, protein: 27, fat: 17 },
      { type: 'dinner', typeLabel: '저녁', menu: '참치 샐러드', calories: 320, carb: 15, protein: 35, fat: 13 },
      { type: 'dinner', typeLabel: '저녁', menu: '통밀빵', calories: 200, carb: 30, protein: 5, fat: 5 },
      { type: 'snack1', typeLabel: '간식', menu: '삶은 계란', calories: 80, carb: 1, protein: 6, fat: 5 },
      { type: 'snack1', typeLabel: '간식', menu: '삶은 계란', calories: 80, carb: 1, protein: 6, fat: 5 },
    ]
  },
  {
    dayId: 4,
    meals: [
      { type: 'breakfast', typeLabel: '아침', menu: '아보카도 토스트', calories: 350, carb: 30, protein: 10, fat: 20 },
      { type: 'breakfast', typeLabel: '아침', menu: '포치드 에그', calories: 140, carb: 10, protein: 8, fat: 8 },
      { type: 'lunch', typeLabel: '점심', menu: '현미밥', calories: 300, carb: 55, protein: 5, fat: 2 },
      { type: 'lunch', typeLabel: '점심', menu: '닭볶음탕', calories: 300, carb: 10, protein: 35, fat: 14 },
      { type: 'dinner', typeLabel: '저녁', menu: '새우 볶음밥', calories: 400, carb: 55, protein: 20, fat: 10 },
      { type: 'dinner', typeLabel: '저녁', menu: '미소국', calories: 150, carb: 15, protein: 10, fat: 4 },
      { type: 'snack1', typeLabel: '간식', menu: '견과류 믹스', calories: 180, carb: 8, protein: 5, fat: 16 },
    ]
  },
  {
    dayId: 5,
    meals: [
      { type: 'breakfast', typeLabel: '아침', menu: '바나나', calories: 100, carb: 25, protein: 1, fat: 0 },
      { type: 'breakfast', typeLabel: '아침', menu: '베리 스무디', calories: 180, carb: 25, protein: 5, fat: 6 },
      { type: 'breakfast', typeLabel: '아침', menu: '치아씨드', calories: 100, carb: 5, protein: 4, fat: 6 },
      { type: 'lunch', typeLabel: '점심', menu: '비빔밥', calories: 500, carb: 70, protein: 20, fat: 15 },
      { type: 'lunch', typeLabel: '점심', menu: '된장국', calories: 120, carb: 10, protein: 5, fat: 3 },
      { type: 'dinner', typeLabel: '저녁', menu: '훈제오리', calories: 400, carb: 10, protein: 35, fat: 24 },
      { type: 'dinner', typeLabel: '저녁', menu: '쌈채소', calories: 180, carb: 20, protein: 10, fat: 4 },
      { type: 'snack1', typeLabel: '간식', menu: '고구마 반개', calories: 130, carb: 30, protein: 2, fat: 0 },
      { type: 'snack2', typeLabel: '간식2', menu: '아메리카노', calories: 5, carb: 1, protein: 0, fat: 0 },
    ]
  },
];

/**
 * 더미 식단 계획 생성 함수
 * TODO: 실제 AI API 연동 시 대체
 */
export const generateDummyDietPlan = (goal: DietGoal, allergies: string[]): DietPlan => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;

  const dailyCalories = GOAL_CALORIES[goal];
  const macros = GOAL_MACROS[goal];

  /* 월~금 5일치 식단 생성 */
  const dailyMeals = DAILY_MEALS_DATA.map((dayData, index) => {
    return {
      dayName: String(dayData.dayId),
      totalCalories: dailyCalories + (index % 2 === 0 ? 0 : 50),
      meals: dayData.meals.map((meal, mealIdx) => ({
        id: dayData.dayId * 100 + mealIdx,
        type: meal.type as MealType,
        typeLabel: meal.typeLabel,
        menu: meal.menu,
        calories: meal.calories,
        nutrients: {
          carb: meal.carb,
          protein: meal.protein,
          fat: meal.fat,
        },
      })),
    };
  });

  /* 고려사항 생성 */
  const considerations: string[] = [];
  
  if (goal === 'diet') {
    considerations.push(`다이어트 목표를 위해 일일 ${dailyCalories}kcal로 설정했습니다.`);
    considerations.push('단백질 비율을 높여 근손실을 방지합니다.');
  } else if (goal === 'bulk') {
    considerations.push(`벌크업 목표를 위해 일일 ${dailyCalories}kcal로 설정했습니다.`);
    considerations.push('탄수화물 비율을 높여 에너지를 충분히 공급합니다.');
  } else {
    considerations.push(`체중 유지를 위해 일일 ${dailyCalories}kcal로 설정했습니다.`);
  }

  if (!allergies.includes('none')) {
    const allergyLabels: { [key: string]: string } = {
      peanut: '땅콩', milk: '우유', egg: '달걀', shellfish: '갑각류',
      wheat: '밀가루', soy: '대두', nuts: '견과류'
    };
    const allergyNames = allergies.map(a => allergyLabels[a]).filter(Boolean);
    if (allergyNames.length > 0) {
      considerations.push(`알러지 식품(${allergyNames.join(', ')})은 제외했습니다.`);
    }
  }

  considerations.push('충분한 수분 섭취를 권장합니다 (2L 이상).');

  return {
    createdAt: `${dateStr} 생성`,
    dailyCalories,
    macros,
    considerations,
    dailyMeals,
  };
};