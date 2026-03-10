import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { ChapterForm } from "./form/ChapterForm";
import { NovelDetail } from "../../novels/components/NovelDetail";

export const LeftSideContent = (novel: NovelDetailDTO) => {
  return (
    <>
      <div className="h-full w-110 px-2">
        <div className="relative flex flex-col h-full w-full ">
          {/* TOP, TITLE  */}
          <div className="flex-center">
            <h4 className="font-bold text-center">{novel.title}</h4>
          </div>
          {/* NOVEL DETAILS AND CHAPTER FORM */}
          <div className="flex flex-col">
            {/* NOVEL DETAILS */}
            <NovelDetail data={novel} />
            {/* CHAPTER FORM */}
            <div className="w-full pr-2">
              <ChapterForm totalChapter={Number(novel.totalChapters)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
