import { EmblaCarouselTween } from "./EmblaCarouselTween";
import { novelListThumbnailsQuery } from "../../api/novels/fetchNovels";
import { useSuspenseQuery } from "@tanstack/react-query";

export const NovelCards = () => {
  const OPTIONS = { loop: true, dragFree: true };

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
