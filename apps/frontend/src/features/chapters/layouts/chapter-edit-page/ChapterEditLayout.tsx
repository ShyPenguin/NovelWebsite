import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { LeftSideContent } from "../../components/LeftSideContent";
import { Main } from "../../components/Main";
import { MutateChapterNavbar } from "../../components/MutateChapterNavbar";
import { LeftSidebar } from "../LeftSidebar";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { ChapterMutateUIProviders } from "@/features/chapters/stores/ChapterMutateUI/ChapterMutateUIProviders";
import { EDIT } from "@/shared/constants";

export const ChapterEditLayout = ({
  novel,
  chapter,
}: {
  novel: NovelDetailDTO;
  chapter: ChapterDetailDTO;
}) => {
  return (
    <ChapterMutateUIProviders type={EDIT} chapter={chapter}>
      <section className="relative min-h-screen dark:bg-primary-black bg-white">
        {/* PAGE NAVBAR */}
        <MutateChapterNavbar />

        {/* LEFT BAR */}
        <div className="px-5 pt-5">
          <LeftSidebar>
            <LeftSideContent {...novel} />
          </LeftSidebar>
        </div>
        <Main chapter={chapter} />
      </section>
    </ChapterMutateUIProviders>
  );
};
