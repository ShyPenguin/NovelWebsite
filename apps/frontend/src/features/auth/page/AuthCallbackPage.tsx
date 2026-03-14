import { queryClient } from "@/routes";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authQueryKey } from "../utils/auth.tanstack-keys";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const handle = async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
    };
    handle();
    navigate({ to: "/" });
  }, []);

  return (
    <div className="min-h-150 size-full flex flex-col items-center justify-center gap-4 text-center">
      <LoadingSpinner />
    </div>
  );
}
