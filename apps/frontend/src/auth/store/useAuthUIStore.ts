import { create } from "zustand";
import type { UserRole } from "@repo/contracts/dto/auth";

type AuthUIState = {
  reason: "login" | "role" | null;
  requiredRoles: UserRole[];

  showLoginModal: boolean;

  requireLogin: () => void;
  requireRoles: (role: UserRole[]) => void;
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
      showLoginModal: true,
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
