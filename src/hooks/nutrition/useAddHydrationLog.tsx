import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHydrationLog } from "../../lib/api/nutrition";
import type { HydrationLog } from "../../types/nutrition.type";

export function useAddHydrationLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HydrationLog) => addHydrationLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hydration-logs"] });
    },
  });
}
