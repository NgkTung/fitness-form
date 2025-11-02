import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../lib/api/profile";
import type { User } from "../../types/user.type";

export function useProfile() {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
