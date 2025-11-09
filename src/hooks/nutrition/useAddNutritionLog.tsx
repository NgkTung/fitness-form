import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNutritionLog } from "../../lib/api/nutrition";
import type { MealLog } from "../../types/nutrition.type";

export function useAddNutritionLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MealLog) => addNutritionLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition-logs"] });
    },
  });
}
