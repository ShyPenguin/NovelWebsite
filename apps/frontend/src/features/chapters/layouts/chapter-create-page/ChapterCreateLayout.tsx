import { CREATE } from "@/shared/constants";
import { ChapterMutateUIProviders } from "@/features/chapters/stores/ChapterMutateUI/ChapterMutateUIProviders";
import {
  PreviewChapterProvider,
  usePreviewChapter,
} from "@/features/chapters/stores/ChapterMutateUI/PreviewChapterContext";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { LeftSideContent } from "../../components/LeftSideContent";
import { MutateChapterNavbar } from "../../components/MutateChapterNavbar";
import { LeftSidebar } from "../LeftSidebar";
import { Main } from "../../components/Main";

export const ChapterCreateLayout = (novel: NovelDetailDTO) => {
  return (
    <PreviewChapterProvider>
      <ChapterMutateUIProviders type={CREATE}>
        <Inner {...novel} />
      </ChapterMutateUIProviders>
    </PreviewChapterProvider>
  );
};

const Inner = (novel: NovelDetailDTO) => {
  const { previewed } = usePreviewChapter();
  return (
    <section className="relative flex size-full min-h-screen dark:bg-primary-black bg-white">
      {/* PAGE NAVBAR */}
      {previewed && <MutateChapterNavbar />}

      {/* LEFT BAR */}
      <div className="px-5 pt-5">
        {!previewed && <LeftSideContent {...novel!} />}
        {previewed && (
          <LeftSidebar>
            <LeftSideContent {...novel!} />
          </LeftSidebar>
        )}
      </div>
      {previewed && <Main />}
    </section>
  );
};
