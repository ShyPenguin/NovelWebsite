import { Suspense, useState } from "react";
import { TrendingNumberOne } from "./TrendingNumberOne";
import { TrendingItem } from "./TrendingItem";
import { useSuspenseQuery } from "@tanstack/react-query";
import SkeletonTrendingList from "./SkeletonTrendingList";
import { novelListTrendsQuery } from "@/api/novels/fetchNovels";
import { NO_IMAGE_URL } from "@/constants";

const TrendingList = ({ option }: { option: number }) => {
  const { data: novels, isSuccess } = useSuspenseQuery(novelListTrendsQuery());

  return (
    <>
      {option === 0 &&
        isSuccess &&
        novels.length > 0 &&
        novels.map((item, index) => {
          return index == 0 ? (
            <TrendingNumberOne
              id={item.id}
              imgURL={item.coverImageUrl ?? NO_IMAGE_URL}
              title={item.title}
              key={index}
            />
          ) : (
            <TrendingItem
              id={item.id}
              rank={index + 1}
              title={item.title}
              coverImageUrl={item.coverImageUrl}
              totalChapters={item.totalChapters}
              key={index}
            />
          );
        })}
    </>
  );
};
export const Trending = () => {
  const [option, setOption] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-left">Trending</h1>
      <div className="flex self-start gap-3">
        <button
          className='rounded py-2 px-4 text-xxs bg-muted-foreground/20 data-[state="active"]:bg-muted-foreground/80 cursor-pointer'
          data-state={option == 0 ? "active" : "inactive"}
          onClick={() => setOption(0)}
        >
          Day
        </button>
        <button
          className='rounded py-2 px-4 text-xxs bg-muted-foreground/20 data-[state="active"]:bg-muted-foreground/80 cursor-pointer'
          data-state={option == 1 ? "active" : "inactive"}
          onClick={() => setOption(1)}
        >
          Week
        </button>
        <button
          className='rounded py-2 px-4 text-xxs bg-muted-foreground/20 data-[state="active"]:bg-muted-foreground/80 cursor-pointer'
          data-state={option == 2 ? "active" : "inactive"}
          onClick={() => setOption(2)}
        >
          All time
        </button>
      </div>
      <Suspense fallback={<SkeletonTrendingList />}>
        <TrendingList option={option} />
      </Suspense>
      {/* {option === 1 &&
        sampleDataWeek &&
        sampleDataWeek.length > 0 &&
        sampleDataWeek.map((item, index) => {
          return index == 0 ? (
            <TrendingNumberOne imgURL={item.imgURL} title={item.title} />
          ) : (
            <TrendingItem
              rank={index + 1}
              title={item.title}
              imgURL={item.imgURL}
              totalChapters={item.totalChapters}
            />
          );
        })}
      {option === 2 &&
        sampleDataDay &&
        sampleDataDay.length > 0 &&
        sampleDataDay.map((item, index) => {
          return index == 0 ? (
            <TrendingNumberOne imgURL={item.imgURL} title={item.title} />
          ) : (
            <TrendingItem
              rank={index + 1}
              title={item.title}
              imgURL={item.imgURL}
              totalChapters={item.totalChapters}
            />
          );
        })} */}
    </div>
  );
};
