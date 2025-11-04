import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Plan } from "../../types/plan.type";
import { savePlan } from "../../lib/api/plan";

export function useSavePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Plan) => savePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-me"] });
    },
  });
}
