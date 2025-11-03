import type { CreateExerciseDto, Exercise } from "../../../types/exercise.type";
import { request } from "../../request";

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

export const getExercises = async (params: Params): Promise<Exercise[]> => {
  return request.get("/exercises", params);
};

export const createExercise = async (data: CreateExerciseDto) => {
  return request.post("/exercises/", data);
};
