import { queryClient } from "@/routes";
import { authURL } from ".";
import { useAuth } from "../store/useAuth";

export const logout = async () => {
  await fetch(`${authURL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  useAuth.getState().clearUser();
  queryClient.setQueryData(["auth"], null);
};
