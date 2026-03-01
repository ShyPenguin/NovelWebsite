import ChapterSearchBar from "@/features/chapters/components/ChapterSearchBar";
import { useState, type ReactNode } from "react";
import { DualTab } from "./latest-novel-updates/DualTab";

export const NovelChaptersPageContent = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [noticesTab, setNoticesTab] = useState(false);

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="w-62.5 h-9.5 text-base font-medium">
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
