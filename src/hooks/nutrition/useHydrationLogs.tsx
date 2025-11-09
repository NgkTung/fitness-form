import { useQuery } from "@tanstack/react-query";
import { getHydrationLogs } from "../../lib/api/nutrition";

export function useHydrationLogs() {
  return useQuery({
    queryKey: ["hydration-logs"],
    queryFn: getHydrationLogs,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
