import { toast } from "react-toastify";
import { authURL } from ".";

type Provider = "google";

export const redirectLogin = async (provider: Provider) => {
  try {
    const returnTo = window.location.pathname + window.location.search;

    window.location.href = `${authURL}/redirect/${provider}?returnTo=${encodeURIComponent(returnTo)}`;
  } catch (err: any) {
    toast.error(err.message);
  }
};
