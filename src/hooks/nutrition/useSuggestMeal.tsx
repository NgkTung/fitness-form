import { useQuery } from "@tanstack/react-query";
import { suggestNutrition } from "../../lib/api/nutrition";
import type { MealPlan } from "../../components/Nutrition/NutritionCard";

export function useSuggestMeal() {
  return useQuery<MealPlan, Error>({
    queryKey: ["suggest-meal"],
    queryFn: () => suggestNutrition(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
