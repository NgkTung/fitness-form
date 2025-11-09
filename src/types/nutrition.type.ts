export interface Meal {
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface MealLog {
  id: number;
  user_id: number;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  log_date: string;
}

export interface Hydration {
  water_ml: number;
}

export interface HydrationLog {
  id: number;
  user_id: number;
  water_ml: number;
  log_time: string;
}
