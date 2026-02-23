import { createContext, useContext, useEffect, useState } from "react";

// theme = false = dark
// theme = true = light
export type AppContextType = {
  theme: boolean;
  setTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SidebarContextType = {
  sideBarOpen: boolean;
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const sidebarContextInitialValue: SidebarContextType = {
  sideBarOpen: false,
  setSideBarOpen: () => null,
};

const contextInitialValue: AppContextType = {
  theme: false,
  setTheme: () => null,
};

export const AppContext = createContext<AppContextType>(contextInitialValue);
export const SidebarContext = createContext<SidebarContextType>(
  sidebarContextInitialValue
);

export const AppProvider = ({ children }: any) => {
  const [theme, setTheme] = useState<boolean>(() => {
    // Check localStorage once on mount
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : true; // default = light
  });

  useEffect(() => {
    // Save whenever theme changes
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      <SidebarProvider>{children}</SidebarProvider>
    </AppContext.Provider>
  );
};

export const SidebarProvider = ({ children }: any) => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  return (
    <SidebarContext.Provider
      value={{
        sideBarOpen,
        setSideBarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
export const useSidebarOpen = () => {
  const ctx = useContext(SidebarContext);

  if (!ctx) {
    throw new Error("useSidebarOpen must be used inside AppContext");
  }
  return ctx;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useAppContext must be used inside AppContext");
  }
  return ctx;
};
