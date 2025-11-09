import { useQuery } from "@tanstack/react-query";
import { getNutritionLogs } from "../../lib/api/nutrition";

export function useNutritionLogs() {
  return useQuery({
    queryKey: ["nutrition-logs"],
    queryFn: getNutritionLogs,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
