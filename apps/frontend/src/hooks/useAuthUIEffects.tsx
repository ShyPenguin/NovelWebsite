// hooks/useAuthUIEffects.ts
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthUIStore } from "../stores/useAuthUIStore";

export function useAuthUIEffects() {
  const { reason, requiredRoles, consume } = useAuthUIStore();

  useEffect(() => {
    if (!reason) return;

    if (reason === "role") {
      toast.error(
        `You need one of the following roles: ${requiredRoles?.join(", ")}`
      );
    }

    consume();
  }, [reason, requiredRoles, consume]);
}
