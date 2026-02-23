import { useAuthUIStore } from "../../stores/useAuthUIStore";
import LoginLayout from "./LoginLayout";

export const LoginModal = () => {
  const showLoginModal = useAuthUIStore((state) => state.showLoginModal);
  return <>{showLoginModal && <LoginLayout />}</>;
};
