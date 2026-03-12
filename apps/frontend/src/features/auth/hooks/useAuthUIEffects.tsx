import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthUIStore } from "../store/useAuthUIStore";

export function useAuthUIEffects() {
  const { errorMessage, consume } = useAuthUIStore();

  useEffect(() => {
    if (!errorMessage) return;

    toast.error(errorMessage);

    consume();
  }, [errorMessage, consume]);
}
