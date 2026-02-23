import { useState, type ReactNode } from "react";
import { DualTab } from "../LatestNovelUpdates/DualTab";
import ChapterSearchBar from "./ChapterSearchBar";

const ChapterListNoticesMain = ({ children }: { children: ReactNode }) => {
  const [noticesTab, setNoticesTab] = useState(false);

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="w-[250px] h-[38px] text-base font-medium">
        <DualTab
          firstTab={noticesTab}
          setFirstTab={setNoticesTab}
          firstTabName="Chapters list"
          secondTabName="Notices"
        />
      </div>
      <div className="h-10 text-border dark:text-secondary-black">
        <ChapterSearchBar />
      </div>
      {children}
    </div>
  );
};

export default ChapterListNoticesMain;
