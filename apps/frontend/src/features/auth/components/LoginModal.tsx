import { useAuthUIStore } from "@/features/auth/store/useAuthUIStore";
import Modal from "@/shared/components/Modal";
import Discord from "@/assets/icons/Discord";
import { redirectLogin } from "../api/redirectLogin";

export const LoginModal = () => {
  const showLoginModal = useAuthUIStore((state) => state.showLoginModal);
  const closeLoginModal = useAuthUIStore((state) => state.closeLoginModal);

  return (
    <>
      {showLoginModal && (
        <Modal onClose={closeLoginModal}>
          <Modal.Body>
            <p className="text-inherit font-semibold text-xl">Welcome back</p>
            <p className="text-dark-muted-foreground text-xs">
              Sign in to continue your journey
            </p>
            <div className="flex flex-col mt-2 gap-4 items-center size-full">
              <div className="flex size-full items-center">
                <div className="h-px grow dark:bg-white bg-primary-black" />
                <p className="px-1 font-medium text-inherit whitespace-nowrap">
                  SIGN IN WITH
                </p>
                <div className="h-px grow dark:bg-white bg-primary-black" />
              </div>

              <button
                className="w-37.5 flex-center py-3 bg-bluerple rounded-xl gap-2 text-white hover:bg-bluerple/90 cursor-pointer"
                onClick={() => redirectLogin("discord")}
              >
                <Discord className="w-5 h-5" />
                <p className="text-md font-semibold">Discord</p>
              </button>
              <button
                className="w-37.5 flex-center py-3 bg-primary-black dark:bg-white rounded-xl gap-2 text-white dark:text-primary-black  hover:bg-primary-black/90 dark:hover:bg-white/90 cursor-pointer"
                onClick={() => redirectLogin("google")}
              >
                <img
                  src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                  className="w-5 h-5"
                />
                <p className="text-inherit text-md font-semibold">Google</p>
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
