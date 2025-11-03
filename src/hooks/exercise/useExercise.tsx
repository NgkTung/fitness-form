import { useQuery } from "@tanstack/react-query";
import type { Exercise } from "../../types/exercise.type";
import { getExercises } from "../../lib/api/exercise";

interface Params {
  muscle_group:
    | "legs"
    | "chest"
    | "back"
    | "shoulders"
    | "arms"
    | "core"
    | "other";
  equipment: "bodyweight" | "basic_gym" | "full_gym";
  difficulty: "beginner" | "intermediate" | "advanced";
  movement_pattern: "squat" | "hinge" | "horizontal_push" | string;
}

export function useExercises(params: Params) {
  return useQuery<Exercise[], Error>({
    queryKey: ["exercises", params],
    queryFn: () => getExercises(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
