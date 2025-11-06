export type Session = {
  plan: number | undefined;
  start_time: string | null;
  end_time: string;
  total_calories: number;
  posture_score_avg: number;
  logs: SessionExercise[];
};

export type SessionExercise = {
  exercise_name: string;
  sets_completed: number;
  reps_completed: string;
};

export type SessionLog = {
  id: number;
  plan: number;
  start_time: string;
  end_time: string;
  total_calories: number;
  posture_score_avg: number;
  logs: ExerciseLog[];
};

export type ExerciseLog = {
  exercise_name: string;
  sets_completed: number;
  reps_completed: string;
  weight_kg: number | null;
  posture_feedback: string | null;
};
