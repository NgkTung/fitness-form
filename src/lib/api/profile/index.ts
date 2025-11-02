import type { User } from "../../../types/user.type";
import { request } from "../../request";

export const getProfile = async (): Promise<User> => {
  return await request.get("/profile");
};

export const udpateProfile = async (updateData: User): Promise<User> => {
  return await request.put("/profile", updateData);
};
