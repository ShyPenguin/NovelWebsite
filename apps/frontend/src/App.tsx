import { useAppContext, useSidebarOpen } from "./stores/AppContext";
import Navbar from "./layouts/Navbar";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Footer } from "./components/Footer";
import Sidebar from "./components/SideBarComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import { useAuthUIEffects } from "./hooks/useAuthUIEffects";
import { LoginModal } from "./layouts/login/LoginModal";
import { memo } from "react";

const MemoizedLoginModal = memo(LoginModal);
const MemoizedNavbar = memo(Navbar);
const MemoizedFooter = memo(() => (
  <div className="flex-center w-full">
    <Footer />
  </div>
));

const SidebarModal = () => {
  const { sideBarOpen } = useSidebarOpen();

  return <>{sideBarOpen && <Sidebar />}</>;
};

function App() {
  const { theme } = useAppContext();
  useAuthUIEffects();
  return (
    <div
      className={`${theme ? "" : "dark"} min-h-screen flex flex-col size-full bg-white text-black dark:text-white dark:bg-primary-black font-montserrat overflow-hidden`}
    >
      <MemoizedNavbar />
      <SidebarModal />
      <div className="flex-1 pt-17.5 text-inherit dark:text-inherit bg-inherit dark:bg-inherit w-full h-full">
        <Outlet />
      </div>
      <MemoizedFooter />
      <ToastContainer />
      <MemoizedLoginModal />
      <TanStackRouterDevtools />
    </div>
  );
}

export default App;
