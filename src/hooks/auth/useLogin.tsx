// src/hooks/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../lib/auth";
import { useAuthStore } from "../../store/useAuthStore";

export function useLogin() {
  const queryClient = useQueryClient();
  const setKey = useAuthStore((s) => s.setKey);

  return useMutation({
    mutationFn: login,
    onSuccess: ({ key }) => {
      setKey(key);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
