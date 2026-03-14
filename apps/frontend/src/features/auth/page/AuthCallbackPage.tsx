import { queryClient } from "@/routes";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authQueryKey } from "../utils/auth.tanstack-keys";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  console.log("At AuthCallBack Page");
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: authQueryKey });

    navigate({ to: "/" });
  }, []);

  return <LoadingSpinner />;
}
