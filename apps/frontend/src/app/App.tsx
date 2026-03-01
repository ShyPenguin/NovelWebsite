import { useAppContext, useSidebarOpen } from "./stores/AppContext";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ToastContainer } from "react-toastify";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryAuthOption } from "../features/auth/api/auth";
import { useAuthUIEffects } from "../features/auth/hooks/useAuthUIEffects";
import { LoginModal } from "../features/auth/components/LoginModal";
import Sidebar from "../shared/components/SideBarComponents/Sidebar";
import Navbar from "./layouts/Navbar";
import { Footer } from "./components/Footer";

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

  // For authentcation (globalized)
  useQuery(queryAuthOption());

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
