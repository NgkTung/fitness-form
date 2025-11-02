import type { Exercise } from "./exercise.type";

export interface Plan {
  id?: number;
  name: string;
  description: string;
  schedule: string | null;
  plan_exercises: Exercise[];
}
