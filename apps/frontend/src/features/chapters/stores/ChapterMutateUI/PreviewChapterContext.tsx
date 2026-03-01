import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type PreviewChapterContextType = {
  previewed: boolean;
  setPreviewed: Dispatch<SetStateAction<boolean>>;
};

const contextInitialValue = {
  previewed: false,
  setPreviewed: () => null,
};

const PreviewChapterContext =
  createContext<PreviewChapterContextType>(contextInitialValue);

export const PreviewChapterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [previewed, setPreviewed] = useState(false);
  return (
    <PreviewChapterContext.Provider
      value={{
        previewed,
        setPreviewed,
      }}
    >
      {children}
    </PreviewChapterContext.Provider>
  );
};

export const usePreviewChapter = () => {
  const ctx = useContext(PreviewChapterContext);
  if (!ctx) {
    throw new Error(
      "usePreviewChapter must be used inside PreviewChapterProvider"
    );
  }
  return ctx;
};
