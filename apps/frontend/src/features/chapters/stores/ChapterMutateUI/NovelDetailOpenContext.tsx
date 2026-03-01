import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type NovelDetailOpenContextType = {
  novelDetailOpen: boolean;
  setNovelDetailOpen: Dispatch<SetStateAction<boolean>>;
};

const contextInitialValue = {
  novelDetailOpen: false,
  setNovelDetailOpen: () => null,
};

const NovelDetailOpenContext =
  createContext<NovelDetailOpenContextType>(contextInitialValue);

export const NovelDetailOpenContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [novelDetailOpen, setNovelDetailOpen] = useState(false);

  return (
    <NovelDetailOpenContext.Provider
      value={{
        novelDetailOpen,
        setNovelDetailOpen,
      }}
    >
      {children}
    </NovelDetailOpenContext.Provider>
  );
};

export const useNovelDetailOpen = () => {
  const ctx = useContext(NovelDetailOpenContext);
  if (!ctx) {
    throw new Error(
      "useNovelDetailOpen must be used inside PreviewChapterProvider"
    );
  }
  return ctx;
};
