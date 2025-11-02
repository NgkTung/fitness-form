export interface User {
  username: string;
  email: string;
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: "male" | "female" | "other";
  activity_level: string | null;
  main_goal: "build_muscle" | "lose_fat" | "maintain" | string;
  experience_level: "beginner" | "intermediate" | "advanced" | string;
  days_per_week: number;
  equipment_available: "none" | "full_gym" | string;
}
