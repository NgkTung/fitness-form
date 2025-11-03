interface PlanExercise {
  id: number;
  exercise_id: number;
  exercise_name: string;
  sets: number;
  reps: string;
  day_number: number;
}

export interface Plan {
  id?: number;
  name: string;
  description: string;
  schedule: string | null;
  plan_exercises: PlanExercise[];
}
