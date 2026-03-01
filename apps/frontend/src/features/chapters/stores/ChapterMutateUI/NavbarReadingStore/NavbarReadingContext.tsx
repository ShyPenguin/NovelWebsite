import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  navbarReadingReducer,
  type NavbarReadingAction,
  type NavbbarReadingStateType,
} from "./navbarReadingReducer";

type NavbarReadingContextType = {
  state: NavbbarReadingStateType;
  dispatch: Dispatch<NavbarReadingAction>;
};

const contextInitialValue = {
  isReadingSettingOpen: false,
  isListChaptersOpen: false,
};

export const NavbarReadingContext = createContext<NavbarReadingContextType>({
  state: contextInitialValue,
  dispatch: () => {},
});

export const useNavbarReadingContext = () => {
  return useContext(NavbarReadingContext);
};

export const NavbarReadingContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    navbarReadingReducer,
    contextInitialValue
  );
  return (
    <NavbarReadingContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </NavbarReadingContext.Provider>
  );
};
