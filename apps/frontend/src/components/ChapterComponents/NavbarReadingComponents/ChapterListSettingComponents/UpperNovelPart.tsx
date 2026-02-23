import { useSuspenseQuery } from "@tanstack/react-query";
import { novelQueryOptions } from "../../../../api/novels/fetchNovel";

export const UpperNovelPart = ({ novelId }: { novelId: string }) => {
  const { data: novel, isSuccess } = useSuspenseQuery(
    novelQueryOptions(novelId)
  );
  return (
    <>
      {isSuccess && (
        <div className="flex flex-col w-full">
          <div className="flex w-full">
            <img
              src={novel.coverImageUrl}
              className="object-cover object-center h-[150px] w-full"
            />
          </div>
          <div className="flex flex-col p-4 border-b-1 gap-1 border-b-black/10 dark:border-b-white/10 ">
            <h1 className="font-bold">{novel.title}</h1>
            <p className="text-muted-foreground dark:text-dark-muted-foreground text-[14px]">
              {novel.totalChapters} Chapters
            </p>
          </div>
        </div>
      )}
    </>
  );
};
