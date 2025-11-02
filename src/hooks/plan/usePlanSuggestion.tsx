import { useQuery } from "@tanstack/react-query";
import type { Plan } from "../../types/plan.type";
import { getPlansSuggestion } from "../../lib/api/plan";

export function usePlanSuggestion() {
  return useQuery<Plan>({
    queryKey: ["plan-suggestion"],
    queryFn: getPlansSuggestion,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
