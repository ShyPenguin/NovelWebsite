import { useChapterPreview } from "@/features/chapters/hooks/useChapterPreview";
import { createContext, useContext } from "react";

type MutatePreviewChapterContextType = ReturnType<typeof useChapterPreview>;

const MutatePreviewChapterContext =
  createContext<MutatePreviewChapterContextType | null>(null);

export const MutatePreviewChapterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mutation = useChapterPreview();

  return (
    <MutatePreviewChapterContext.Provider value={mutation}>
      {children}
    </MutatePreviewChapterContext.Provider>
  );
};

export const useMutatePreviewChapter = () => {
  const ctx = useContext(MutatePreviewChapterContext);
  if (!ctx) {
    throw new Error(
      "useMutatePreviewChapter must be used inside MutatePreviewChapterProvider",
    );
  }
  return ctx;
};
