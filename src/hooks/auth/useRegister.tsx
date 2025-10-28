// src/hooks/useRegister.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../../lib/auth";
import { useAuthStore } from "../../store/useAuthStore";

export function useRegister() {
  const queryClient = useQueryClient();
  const setKey = useAuthStore((s) => s.setKey);

  return useMutation({
    mutationFn: register,
    onSuccess: ({ key }) => {
      setKey(key);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
