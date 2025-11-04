import type { Plan } from "../../../types/plan.type";
import { request } from "../../request";

export const getPlansSuggestion = async (): Promise<Plan> => {
  return await request.get("/plans/generate");
};

export const getMyPlans = async (): Promise<Plan[]> => {
  return await request.get("/plans");
};

export const getPlanDetail = async (id: number): Promise<Plan> => {
  return await request.get(`/plans/${id}`);
};

export const savePlan = async (plan: Plan): Promise<Plan> => {
  return await request.post("/plans", plan);
};
