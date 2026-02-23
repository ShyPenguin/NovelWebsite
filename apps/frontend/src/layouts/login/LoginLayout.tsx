import { useLayoutEffect } from "react";
import { Discord, XIcon } from "../../assets/icons/Index";
import { redirectLogin } from "../../api/auth/redirectLogin";
import { useAuthUIStore } from "../../stores/useAuthUIStore";

const LoginLayout = () => {
  const closeLoginModal = useAuthUIStore((state) => state.closeLoginModal);

  useLayoutEffect(() => {
    // Save the current overflow value
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
  return (
    <div className="modal-background z-100 flex-center">
      <div className="w-fit h-fit bg-primary-black rounded-xl py-8 px-10 relative shadow-2xs shadow-muted-foreground">
        <button
          className="absolute top-4 right-4 cursor-pointer text-dark-muted-foreground hover:text-white"
          onClick={() => closeLoginModal()}
        >
          <XIcon className={"h-5 w-5"} />
        </button>
        <div className="size-full flex flex-col items-center gap-2">
          <p className="text-white font-semibold text-xl">Welcome back</p>
          <p className="text-dark-muted-foreground text-xs">
            Sign in to continue your journey
          </p>
          <div className="flex flex-col mt-2 gap-4 items-center size-full">
            <div className="flex size-full items-center">
              <div className="h-[1px] flex-grow bg-white" />
              <p className="px-1 font-medium text-white whitespace-nowrap">
                SIGN IN WITH
              </p>
              <div className="h-[1px] flex-grow bg-white" />
            </div>
            <button
              className="w-[150px] flex-center py-3 bg-bluerple rounded-xl gap-2 text-white hover:bg-bluerple/90 cursor-pointer"
              onClick={() => redirectLogin("google")}
            >
              <Discord className="w-5 h-5" />
              <p className="text-md font-semibold">Discord</p>
            </button>
            <button
              className="w-[150px] flex-center py-3 bg-white rounded-xl gap-2 text-primary-black hover:bg-white/90 cursor-pointer"
              onClick={() => redirectLogin("google")}
            >
              <img
                src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                className="w-5 h-5"
              />
              <p className="text-md font-semibold">Google</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
