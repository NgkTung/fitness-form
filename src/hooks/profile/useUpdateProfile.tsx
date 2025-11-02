import { useMutation, useQueryClient } from "@tanstack/react-query";
import { udpateProfile } from "../../lib/api/profile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: udpateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
