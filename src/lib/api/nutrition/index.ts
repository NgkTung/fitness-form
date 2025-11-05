import type { MealPlan } from "../../../components/Nutrition/NutritionCard";
import type { Meal, MealLog } from "../../../types/nutrition.type";
import { request } from "../../request";

export const suggestNutrition = async (): Promise<MealPlan> => {
  return await request.get("/nutrition/suggest");
};

export const postMeal = async (meal: Meal): Promise<MealLog> => {
  return await request.post("/nutrition-logs", meal);
};
