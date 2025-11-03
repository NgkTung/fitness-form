import { request } from "../../request";
import Cookies from "js-cookie";

type LoginBody = { username: string; password: string };
type RegisterBody = {
  username: string;
  email: string;
  password1: string;
  password2: string;
};
type Response = { key: string };

export const login = async (body: LoginBody) => {
  const data = await request.post<Response>("/auth/login", body);
  Cookies.set("key", data.key, { sameSite: "lax", secure: true, expires: 7 });
  return data;
};

export const register = async (body: RegisterBody) => {
  const data = await request.post<Response>("/auth/registration/", body);
  Cookies.set("key", data.key, { sameSite: "lax", secure: true });
  return data;
};
