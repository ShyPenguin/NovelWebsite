import { useChapterReadingContext } from "../../stores/ChapterReadingSettingContext";
import HorizontalLine from "../HorizontalLine";
import { formatTimeAgo } from "../../utils";
import DocumentToHTML from "../DocumentToHTML";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";

export const Content = ({ chapter }: { chapter: ChapterDetailDTO }) => {
  const { state } = useChapterReadingContext();

  return (
    <section className="flex-center flex-col gap-3 bg-inherit">
      <div
        style={{
          fontSize: `${state.fontSize}px`,
          lineHeight: `${state.lineSpacing}`,
          textAlign: `${state.textAlignment == 0 ? "left" : state.textAlignment == 1 ? "center" : "justify"}`,
        }}
        className="leading-relaxed px-10 lg:px-80"
      >
        <div className="mb-5">
          <p className="font-semibold">{chapter.title}</p>
          <div
            className="flex justify-between text-muted-foreground dark:text-dark-muted-foreground pb-1"
            style={{ fontSize: `${state.fontSize - 4}px` }}
          >
            <p className="italic">Chapter {chapter.chapterNumber}</p>
            <p>{formatTimeAgo(chapter.updatedAt.toISOString())}</p>
          </div>
          <HorizontalLine />
        </div>
        <DocumentToHTML htmlContent={chapter.contentHtml} />
      </div>
    </section>
  );
};
