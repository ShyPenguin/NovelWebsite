import DocumentToHTML from "@/features/chapters/components/DocumentToHTML";
import HorizontalLine from "@/shared/components/HorizontalLine";
import { formatTimeAgo } from "@/shared/utils";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { useChapterReadingContext } from "../stores/ChapterReadingSettingContext";

export const ChapterPageContent = ({
  chapter,
}: {
  chapter: ChapterDetailDTO;
}) => {
  const { state } = useChapterReadingContext();

  return (
    <section className="flex-center flex-col gap-3 bg-inherit">
      <div
        style={{
          fontSize: `${state.fontSize}px`,
          lineHeight: `${state.lineSpacing}`,
          textAlign: `${state.textAlignment == 0 ? "left" : state.textAlignment == 1 ? "center" : "justify"}`,
        }}
        className="leading-relaxed w-full px-10 lg:px-80"
      >
        <div className="mb-5">
          <p className="font-semibold text-left">{chapter.title}</p>
          <div
            className="flex justify-between text-muted-foreground dark:text-dark-muted-foreground pb-1"
            style={{ fontSize: `${state.fontSize - 4}px` }}
          >
            <p className="italic">Chapter {chapter.chapterNumber}</p>
            <p>{formatTimeAgo(chapter.updatedAt.toISOString())}</p>
          </div>
          <HorizontalLine />
        </div>
        <div className="flex size-full justify-center">
          <DocumentToHTML htmlContent={chapter.contentHtml} />
        </div>
      </div>
    </section>
  );
};
