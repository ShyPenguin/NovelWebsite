import { create } from "zustand";

type AuthUIState = {
  showLoginModal: boolean;
  errorMessage: string;
  requireLogin: () => void;
  requirePermission: (message: string) => void;
  closeLoginModal: () => void;
  consume: () => void;
};

export const useAuthUIStore = create<AuthUIState>((set) => ({
  reason: null,
  requiredRoles: [],
  showLoginModal: false,
  errorMessage: "",
  requireLogin: () =>
    set({
      errorMessage: "",
      showLoginModal: true,
    }),
  requirePermission: (message) =>
    set({
      errorMessage: message,
    }),
  closeLoginModal: () =>
    set({
      showLoginModal: false,
    }),
  consume: () =>
    set({
      errorMessage: "",
    }),
}));
