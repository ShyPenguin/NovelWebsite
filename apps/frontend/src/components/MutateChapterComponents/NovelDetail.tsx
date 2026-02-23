import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { Schedule } from "../Schedule/Schedule";
import { NO_AUTHOR, NO_IMAGE_URL } from "@/constants";

export const NovelDetail = ({ data }: { data: NovelDetailDTO }) => {
  return (
    <div className="flex flex-col">
      <div className="flex space-x-2">
        {/* PICTURE */}
        <div className="w-42.25 h-60">
          <img
            className="size-full rounded-2xl dark:border-primary-black border-white border-4"
            src={data.coverImageUrl ?? NO_IMAGE_URL}
          />
        </div>
        {/* NOVEL DETAILS */}
        <div className="flex flex-col pt-2">
          <div className="flex-center pb-2">
            <Schedule schedule={data.schedule} />
          </div>
          <div className="flex justify-between">
            <h5>Release year</h5>
            <h5>{new Date(data.release).getFullYear()}</h5>
          </div>
          <div className="flex justify-between">
            <h5>Author</h5>
            <h5>{data.author ? data.author.name : NO_AUTHOR}</h5>
          </div>
          <div className="flex justify-between">
            <h5>Total Chapters</h5>
            <h5>{data.totalChapters}</h5>
          </div>
          <div className="flex justify-between">
            <h5>Bookmarks</h5>
            <h5>{4}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};
