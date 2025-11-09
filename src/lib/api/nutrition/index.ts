import type { MealPlan } from "../../../components/Nutrition/NutritionCard";
import type {
  HydrationLog,
  Meal,
  MealLog,
} from "../../../types/nutrition.type";
import { request } from "../../request";

export const suggestNutrition = async (): Promise<MealPlan> => {
  return await request.get("/nutrition/suggest/");
};

export const getNutritionLogs = async (): Promise<MealLog[]> => {
  return await request.get("/nutrition-logs/");
};

export const getHydrationLogs = async (): Promise<HydrationLog[]> => {
  return await request.get("/hydration-logs/");
};

export const addNutritionLog = async (
  nutrionData: MealLog
): Promise<MealLog> => {
  return await request.post("/nutrition-logs/", nutrionData);
};

export const addHydrationLog = async (
  hydrationData: HydrationLog
): Promise<HydrationLog> => {
  return await request.post("/hydration-logs/", hydrationData);
};

export const postMeal = async (meal: Meal): Promise<MealLog> => {
  return await request.post("/nutrition-logs/", meal);
};
