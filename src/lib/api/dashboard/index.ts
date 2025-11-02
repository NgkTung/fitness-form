import type { DashboardData } from "../../../types/dashboard.type";
import { request } from "../../request";

export const getDashboard = async (): Promise<DashboardData> => {
  return await request.get("/dashboard");
};
