import { toast } from "react-toastify";
import { authURL } from "../auth.constant";
import { queryClient } from "@/routes";
import { authQueryKey } from "../utils/auth.tanstack-keys";

type Provider = "google";

export const redirectLogin = async (provider: Provider) => {
  try {
    // const returnTo = window.location.pathname + window.location.search;
    const returnTo = "/auth/callback";
    queryClient.resetQueries({ queryKey: authQueryKey, exact: true });
    window.location.href = `${authURL}/redirect/${provider}?returnTo=${encodeURIComponent(returnTo)}`;
  } catch (err: any) {
    toast.error(err.message);
  }
};
