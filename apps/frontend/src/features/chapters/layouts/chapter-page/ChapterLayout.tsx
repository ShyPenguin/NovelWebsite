import { ChapterListSetting } from "@/features/chapters/components/chapter-list-components/ChapterListSetting";
import ReadingSetting from "@/features/chapters/components/reading-setting-components/ReadingSetting";
import { useNavbarReadingContext } from "@/features/chapters/stores/ChapterMutateUI/NavbarReadingStore/NavbarReadingContext";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { AnimatePresence } from "motion/react";
import NavbarReading from "../../components/navbar-reading-components/NavbarReading";
import { ChapterPageContent } from "@/features/chapters/components/ChapterPageContent";
import { ChapterReadingSettingProvider } from "../../stores/ChapterReadingSettingContext";

export const ChapterLayout = ({ chapter }: { chapter: ChapterDetailDTO }) => {
  const { state } = useNavbarReadingContext();

  return (
    <div className="flex flex-col size-full bg-inherit dark:bg-inherit">
      <NavbarReading />
      <ChapterReadingSettingProvider>
        <AnimatePresence>
          {state.isReadingSettingOpen && <ReadingSetting />}
          {state.isListChaptersOpen && <ChapterListSetting id={chapter.id} />}
        </AnimatePresence>
        <div className="pt-20">
          <ChapterPageContent chapter={chapter} />
        </div>
      </ChapterReadingSettingProvider>
    </div>
  );
};
