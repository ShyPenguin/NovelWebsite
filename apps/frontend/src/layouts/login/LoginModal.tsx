import { useAuthUIStore } from "../../auth/store/useAuthUIStore";
import LoginLayout from "./LoginLayout";

export const LoginModal = () => {
  const showLoginModal = useAuthUIStore((state) => state.showLoginModal);
  return <>{showLoginModal && <LoginLayout />}</>;
};
