import { authURL } from ".";
import { queryOptions } from "@tanstack/react-query";
import { useAuth } from "../store/useAuth";
import { INTERVAL_24_HRS } from "@/shared/constants";
import type { AuthType } from "../auth.type";

const fetchAuth = async (): Promise<AuthType | null> => {
  const res = await fetch(`${authURL}/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    useAuth.getState().clearUser();
    return null;
  }
  const data = await res.json();
  useAuth.getState().setUser(data);
  return data;
};
export const queryAuthOption = () =>
  queryOptions<AuthType | null>({
    queryKey: ["auth"],
    queryFn: fetchAuth,
    staleTime: INTERVAL_24_HRS,
  });
