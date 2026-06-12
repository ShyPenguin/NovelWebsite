import { Bookmark } from "@/features/bookmarks/components/Bookmark";
import { CHAPTER_SEARCH_DEFAULT } from "@/features/chapters/chapter.schema";
import { chaptersRoute, NO_IMAGE_URL } from "@/shared/constants";
import type { NovelThumbnailDTO } from "@repo/contracts/dto/novel";
import { Link } from "@tanstack/react-router";

type NovelThumbnailProp =
  | {
      novel: NovelThumbnailDTO;
      bookmark?: never;
      onClick?: never;
    }
  | {
      novel: NovelThumbnailDTO;
      bookmark: boolean;
      onClick: () => void;
    };

export const NovelThumbnail = ({
  novel,
  bookmark,
  onClick,
}: NovelThumbnailProp) => {
  return (
    <Link
      className="flex w-full gap-4 relative"
      to={chaptersRoute}
      params={{ novelId: novel.id, slug: novel.slug }}
      search={CHAPTER_SEARCH_DEFAULT}
    >
      <img
        className="h-full min-h-36.5 lg:min-h-45 w-25 lg:w-30 rounded-2xl object-cover"
        src={novel.coverImageUrl ? novel.coverImageUrl : NO_IMAGE_URL}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-primary-black dark:text-white font-bold text-lg line-clamp-1">
          {novel.title}
        </h1>
        <div className="flex flex-col gap-2">
          <p className="line-clamp-5 text-[14px]">{novel.description}</p>
        </div>
      </div>

      {bookmark && (
        <div className="absolute top-0 left-2">
          {/* <div
            className="absolute w-8 h-8"
            onClick={() => {
              navigate({
                to: novelIdRoute,
                params: { novelId: novel.id, slug: novel.slug },
              });
            }}
          >
            <ButtonIcon>
              <Pencil className="w-full h-full rotate-270" />
            </ButtonIcon>
          </div> */}

          <Bookmark bookmarked={bookmark} onClick={onClick} />
        </div>
      )}
    </Link>
  );
};
