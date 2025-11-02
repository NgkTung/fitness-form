import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "../../types/dashboard.type";
import { getDashboard } from "../../lib/api/dashboard";

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
