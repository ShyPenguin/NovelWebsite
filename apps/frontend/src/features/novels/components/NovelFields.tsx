import { Schedule } from "@/shared/components/Schedule/Schedule";
import { NO_AUTHOR } from "@/shared/constants";
import { capitalizeFirstLetter, getFormattedDate } from "@/shared/utils";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";

export const NovelFields = ({ novel }: { novel: NovelDetailDTO }) => {
  return (
    <div className="novel-form grid-area-novel-form gap-2">
      {/* TITLE */}
      <div className="[grid-area:a] novel-form-child">
        <label className="form-label">Title</label>
        <h3 className="text-xl font-bold text-center">{novel.title}</h3>
      </div>
      {/* TYPE */}
      <div className="[grid-area:b] novel-form-child">
        <label className="form-label">Type</label>
        <div className="w-full">
          <h5>{capitalizeFirstLetter(novel.type as string)}</h5>
        </div>
      </div>
      {/* Language*/}
      <div className="[grid-area:c] novel-form-child">
        <label className="form-label">Language</label>
        <div className="w-full">
          <h5>{capitalizeFirstLetter(novel.language as string)}</h5>
        </div>
      </div>
      {/* AUTHOR */}
      <div className="[grid-area:d] novel-form-child">
        <label className="form-label">Author</label>
        <div className="w-full">
          <h5>{novel.author?.name ?? `${NO_AUTHOR}`}</h5>
        </div>
      </div>
      {/* DATE */}
      <div className="[grid-area:e] novel-form-child">
        <label className="form-label">Release Date</label>
        <div className="w-full">
          <h5>{getFormattedDate(new Date(novel.release))}</h5>
        </div>
      </div>
      {/* STATUS */}
      <div className="[grid-area:g] novel-form-child">
        <label className="form-label">Status</label>
        <p className="status text-[16px] rounded-xl">{novel.status}</p>
      </div>
      {/* SCHEDULE */}
      <div className="[grid-area:i] novel-form-child">
        <label className="form-label">Schedule</label>
        <div className="flex w-full justify-center">
          <Schedule schedule={novel.schedule} />
        </div>
      </div>
      <div className="[grid-area:f] novel-form-child h-full min-h-0">
        <label className="form-label">Description</label>
        <h5 className="text-start px-2">{novel.description}</h5>
      </div>
    </div>
  );
};
