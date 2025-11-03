export interface User {
  username: string;
  email: string;
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: "male" | "female" | "other";
  activity_level:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active"
    | null;
  main_goal: "build_muscle" | "lose_weight" | "maintain" | null;
  experience_level: "beginner" | "intermediate" | "advanced" | string;
  days_per_week: number;
  equipment_available: "bodyweight" | "basic_gym" | "full_gym" | string;
}
