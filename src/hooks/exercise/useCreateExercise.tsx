import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateExerciseDto } from "../../types/exercise.type";
import { createExercise } from "../../lib/api/exercise";

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExerciseDto) => createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}
