import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Session } from "../../types/session.type";
import { saveSession } from "../../lib/api/session";

export function useSaveSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Session) => saveSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-logs"] });
    },
  });
}
