import { queryClient } from "@/routes";
import { authURL } from "../auth.constant";
import { authQueryKey } from "../utils/auth.tanstack-keys";

export const logout = async () => {
  await fetch(`${authURL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  queryClient.setQueryData(authQueryKey, null);
  //? This refetches the novel query
  //? Good 2nd option when you want to remove bookmark during logout
  // queryClient.invalidateQueries({
  //   queryKey: ["novel"],
  //   refetchType: "active",
  // });
};
