export interface Exercise {
  id: number;
  name: string;
  description: string;
  video_url: string;
  muscle_group:
    | "legs"
    | "chest"
    | "back"
    | "shoulders"
    | "arms"
    | "core"
    | "other"
    | string;
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: "bodyweight" | "basic_gym" | "full_gym";
  movement_pattern:
    | "squat"
    | "hinge"
    | "horizontal_push"
    | "vertical_push"
    | "pull"
    | "carry"
    | "rotation"
    | "other"
    | string;
}

export interface CreateExerciseDto {
  name: string;
  description: string;
  video_url?: string;
  muscle_group:
    | "legs"
    | "chest"
    | "back"
    | "shoulders"
    | "arms"
    | "core"
    | "other";
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: "bodyweight" | "basic_gym" | "full_gym";
  movement_pattern:
    | "squat"
    | "hinge"
    | "horizontal_push"
    | "vertical_pull"
    | "vertical_push"
    | "carry"
    | "rotation"
    | "other";
}
