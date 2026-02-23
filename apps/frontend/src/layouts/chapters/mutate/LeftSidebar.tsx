import { type ReactNode } from "react";
import { SidebarAnimated } from "../../../components/SidebarAnimated";
import { AnimatePresence } from "motion/react";
import { useNovelDetailOpen } from "../../../stores/ChapterMutateUI/NovelDetailOpenContext";

export const LeftSidebar = ({ children }: { children: ReactNode }) => {
  const { novelDetailOpen, setNovelDetailOpen } = useNovelDetailOpen();

  return (
    <>
      <AnimatePresence>
        {novelDetailOpen && (
          <SidebarAnimated
            onClose={() => setNovelDetailOpen(false)}
            right={false}
          >
            {children}
          </SidebarAnimated>
        )}
      </AnimatePresence>
    </>
  );
};
