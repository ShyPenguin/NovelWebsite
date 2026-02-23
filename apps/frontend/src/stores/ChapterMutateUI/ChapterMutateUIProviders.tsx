import { createContext, useContext, type ReactNode } from "react";
import { MutatePreviewChapterProvider } from "./MutatePreviewChapterContext";
import { NovelDetailOpenContextProvider } from "./NovelDetailOpenContext";
import type { MutateTypes } from "../../types";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";

type ChapterUIMutateContextType = {
  type: MutateTypes;
  chapter: ChapterDetailDTO | null;
};

const ChapterUIMutateContext = createContext<ChapterUIMutateContextType>({
  type: "CREATE",
  chapter: null,
});

export const ChapterMutateUIProviders = ({
  children,
  type,
  chapter = null,
}: {
  children: ReactNode;
  type: MutateTypes;
  chapter?: ChapterDetailDTO | null;
}) => {
  return (
    <ChapterUIMutateContext.Provider value={{ type, chapter }}>
      <NovelDetailOpenContextProvider>
        <MutatePreviewChapterProvider>{children}</MutatePreviewChapterProvider>
      </NovelDetailOpenContextProvider>
    </ChapterUIMutateContext.Provider>
  );
};

export const useChapterMutateUIType = () => {
  const ctx = useContext(ChapterUIMutateContext);
  if (!ctx) {
    throw new Error(
      "useChapterMutateUIType must be used inside ChapterMutateUIProviders",
    );
  }
  return ctx;
};
