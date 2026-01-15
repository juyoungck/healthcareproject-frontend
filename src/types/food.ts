export type UnitType = 'g' | 'ml';

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