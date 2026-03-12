import { queryClient } from "@/routes";
import { authURL } from ".";
import { authQueryKey } from "../utils/auth.tanstack-keys";

export const logout = async () => {
  await fetch(`${authURL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  queryClient.setQueryData(authQueryKey, null);
};
