// src/hooks/useRegister.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../../lib/api/auth";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
