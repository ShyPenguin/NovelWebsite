import { authURL } from "../auth.constant";
import { queryOptions } from "@tanstack/react-query";
import { authQueryKey } from "../utils/auth.tanstack-keys";
import type { AuthDTO } from "@repo/contracts/dto/auth";

const fetchAuth = async (): Promise<AuthDTO | null> => {
  const res = await fetch(`${authURL}/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};

export const queryAuthOption = () =>
  queryOptions<AuthDTO | null>({
    queryKey: authQueryKey,
    queryFn: fetchAuth,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
    retry: false,
  });
