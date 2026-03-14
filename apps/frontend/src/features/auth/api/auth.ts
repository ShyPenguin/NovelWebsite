import { authURL } from "../auth.constant";
import { queryOptions } from "@tanstack/react-query";
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
    initialData: null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
    retry: false,
  });
