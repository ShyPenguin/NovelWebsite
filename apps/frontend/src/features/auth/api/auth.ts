import { authURL } from ".";
import { queryOptions } from "@tanstack/react-query";
import { INTERVAL_24_HRS } from "@/shared/constants";
import type { AuthType } from "../auth.type";
import { authQueryKey } from "../utils/auth.tanstack-keys";

const fetchAuth = async (): Promise<AuthType | null> => {
  const res = await fetch(`${authURL}/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};

export const queryAuthOption = () =>
  queryOptions<AuthType | null>({
    queryKey: authQueryKey,
    queryFn: fetchAuth,
    staleTime: INTERVAL_24_HRS,
  });
