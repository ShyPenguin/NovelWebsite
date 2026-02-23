// stores/useAuthUIStore.ts
import { create } from "zustand";
import type { Role } from "../types/AuthType";

type AuthUIState = {
  reason: "login" | "role" | null;
  requiredRoles: Role[];

  showLoginModal: boolean;

  requireLogin: () => void;
  requireRoles: (role: Role[]) => void;
  closeLoginModal: () => void;
  consume: () => void;
};

export const useAuthUIStore = create<AuthUIState>((set) => ({
  reason: null,
  requiredRoles: [],
  showLoginModal: false,
  requireLogin: () =>
    set({
      reason: "login",
      showLoginModal: true, // ✅ trigger modal
    }),

  requireRoles: (roles) =>
    set({
      reason: "role",
      requiredRoles: roles,
    }),
  closeLoginModal: () =>
    set({
      showLoginModal: false,
    }),
  consume: () =>
    set({
      reason: null,
      requiredRoles: [],
    }),
}));
