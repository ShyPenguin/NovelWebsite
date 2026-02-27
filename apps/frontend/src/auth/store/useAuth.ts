import type { AuthType } from "@/types/AuthType";
import { create } from "zustand";

type AuthState = {
  user: AuthType | null;
  setUser: (user: AuthType | null) => void;
  clearUser: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
