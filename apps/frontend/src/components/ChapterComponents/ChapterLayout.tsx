import { AnimatePresence } from "motion/react";
import { ChapterReadingSettingProvider } from "../../stores/ChapterReadingSettingContext";
import { useNavbarReadingContext } from "../../stores/NavbarReadingStore/NavbarReadingContext";
import { Content } from "./Content";
import { ChapterListSetting } from "./NavbarReadingComponents/ChapterListSettingComponents/ChapterListSetting";
import NavbarReading from "./NavbarReadingComponents/NavbarReading";
import ReadingSetting from "./NavbarReadingComponents/ReadingSetting";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";

const ChapterLayout = ({ chapter }: { chapter: ChapterDetailDTO }) => {
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
          <Content chapter={chapter} />
        </div>
      </ChapterReadingSettingProvider>
    </div>
  );
};

export default ChapterLayout;
