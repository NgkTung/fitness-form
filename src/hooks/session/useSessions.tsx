import { useQuery } from "@tanstack/react-query";
import { listSession } from "../../lib/api/session";
import type { SessionLog } from "../../types/session.type";

export function useSessions() {
  return useQuery<SessionLog[]>({
    queryKey: ["session-logs"],
    queryFn: listSession,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
