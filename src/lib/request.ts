import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: `${API_URL}/api/v1` });

api.interceptors.request.use((config) => {
  const key = Cookies.get("key");
  if (key) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Token ${key}`;
  }
  return config;
});

export const request = {
  get: async <T>(url: string, params?: Record<string, any>) => {
    const { data } = await api.get<T>(url, { params });
    return data;
  },
  post: async <T, B = unknown>(url: string, body: B) => {
    const { data } = await api.post<T>(url, body);
    return data;
  },
  put: async <T, B = unknown>(url: string, body: B) => {
    const { data } = await api.put<T>(url, body);
    return data;
  },
  patch: async <T, B = unknown>(url: string, body: B) => {
    const { data } = await api.patch<T>(url, body);
    return data;
  },
  delete: async <T = void>(url: string) => {
    const { data } = await api.delete<T>(url);
    return data;
  },
  postForm: async <T>(url: string, form: FormData) => {
    const { data } = await api.post<T>(url, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
