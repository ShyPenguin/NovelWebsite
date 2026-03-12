import { EmblaCarouselTween } from "./EmblaCarouselTween";
import { novelListThumbnailsQuery } from "../../api/fetchNovels";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { EmblaOptionsType } from "embla-carousel";

export const NovelCards = () => {
  const OPTIONS = {
    loop: true,
    dragFree: true,
  } satisfies EmblaOptionsType;

  const { data: novels, isSuccess } = useSuspenseQuery(
    novelListThumbnailsQuery(),
  );

  return (
    <>
      {isSuccess && novels.length > 0 && (
        <EmblaCarouselTween options={OPTIONS} slides={novels} />
      )}
    </>
  );
};
