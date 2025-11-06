import type { Session, SessionLog } from "../../../types/session.type";
import { request } from "../../request";

export const saveSession = async (log: Session) => {
  return await request.post("/sessions/", log);
};

export const listSession = async (): Promise<SessionLog[]> => {
  return await request.get("/sessions/");
};
