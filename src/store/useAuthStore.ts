// src/store/auth.ts
import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  name?: string;
} | null;

type AuthState = {
  user: User;
  key: string | null;
  setUser: (user: User) => void;
  setKey: (key: string | null) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  key: null,
  setUser: (user) => set({ user }),
  setKey: (key) => set({ key }),
  reset: () => set({ user: null, key: null }),
}));
