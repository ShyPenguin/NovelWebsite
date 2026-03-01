import { useMutatePreviewChapter } from "../stores/ChapterMutateUI/MutatePreviewChapterContext";
import DocumentToHTML from "./DocumentToHTML";
import type {
  ChapterDetailDTO,
  ChapterPreviewDTO,
} from "@repo/contracts/dto/chapter";
import HorizontalLine from "@/shared/components/HorizontalLine";

type MainProp = {
  chapter?: ChapterDetailDTO;
};
export const Main = ({ chapter }: MainProp) => {
  const { data, isSuccess, isPending } = useMutatePreviewChapter();

  const ContentDisplay = () => {
    if (isPending) {
      return <></>;
    }
    if (isSuccess) {
      return <Content chapter={data} />;
    }

    if (chapter) {
      return (
        <Content
          chapter={{
            sourceDocUrl: chapter.title,
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
            contentHtml: chapter.contentHtml,
            status: chapter.status,
            access: chapter.access,
            publishedAt: chapter.publishedAt,
          }}
        />
      );
    }
    return <></>;
  };

  return (
    <>
      <div className="w-full justify-center">
        {/* <HorizontalLine /> */}
        <div className="pt-15">
          <ContentDisplay />
        </div>
      </div>
    </>
  );
};

const Content = ({ chapter }: { chapter: ChapterPreviewDTO }) => {
  return (
    <div className="flex-center flex-col gap-y-4">
      <div className="w-full lg:w-187.5 px-4">
        <p className="font-semibold mb-2">Title: {chapter.title}</p>
        <div className="flex justify-between text-muted-foreground dark:text-dark-muted-foreground pb-1 text-xs">
          <p>Chapter's Number: {chapter.chapterNumber}</p>
          <p>Status: {chapter.status}</p>
          <p>Access: {chapter.access}</p>
          <p>
            Published Date:{" "}
            {chapter.publishedAt
              ? chapter.publishedAt.toLocaleDateString()
              : "(blank)"}
          </p>
        </div>
        <HorizontalLine />
      </div>
      <DocumentToHTML htmlContent={chapter.contentHtml} />
    </div>
  );
};
