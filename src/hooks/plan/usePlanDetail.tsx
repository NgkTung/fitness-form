import { useQuery } from "@tanstack/react-query";
import { getPlanDetail } from "../../lib/api/plan";

export function usePlanDetail(id: number) {
  return useQuery({
    queryKey: ["plan-detail", id],
    queryFn: () => getPlanDetail(id),
  });
}
