import { authURL } from ".";
import { queryClient } from "../../routes";

export const logout = async () => {
  await fetch(`${authURL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  // 3️⃣ Optimistically set auth to "logged out"
  queryClient.setQueryData(["auth"], null);
};
