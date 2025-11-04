import { useQuery } from "@tanstack/react-query";
import type { Plan } from "../../types/plan.type";
import { getMyPlans } from "../../lib/api/plan";

export function useMyPlans() {
  return useQuery<Plan[]>({
    queryKey: ["plan-me"],
    queryFn: getMyPlans,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
