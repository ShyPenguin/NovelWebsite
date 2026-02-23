import { authURL } from ".";
import { queryOptions } from "@tanstack/react-query";
import type { AuthType } from "../../types/AuthType";
import { INTERVAL_24_HRS } from "../../constants";

const fetchAuth = async (): Promise<AuthType | null> => {
  const res = await fetch(`${authURL}/me`, {
    credentials: "include",
  });

  if (!res.ok) return null;
  return await res.json();
};
export const queryAuthOption = () =>
  queryOptions<AuthType | null>({
    queryKey: ["auth"],
    queryFn: fetchAuth,
    staleTime: INTERVAL_24_HRS,
  });
