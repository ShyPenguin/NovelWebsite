import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { novelsListQuery } from "../../api/novels/fetchNovels";
import { Suspense } from "react";
import { NovelSearchSchema } from "../../schemas/novels";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { NO_IMAGE_URL } from "@/constants";
import { ProtectedLink } from "@/components/ProtectedLink";
import Pencil from "@/assets/icons/Pencil";
import { CHAPTER_SEARCH_DEFAULT } from "@/schemas/chapters";
import ButtonIcon from "@/components/ButtonIcon";

export const Route = createFileRoute("/novels/")({
  validateSearch: (search) => NovelSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-7">
      <Suspense fallback={<SkeletonNovels />}>
        <Content />
      </Suspense>
    </div>
  );
}

const Content = () => {
  const { sort, search, status } = Route.useSearch();

  const { data: novels, isSuccess } = useSuspenseQuery(
    novelsListQuery({ sort, status, search }),
  );
  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {isSuccess &&
        novels.length > 0 &&
        novels.map((novel) => (
          <li key={novel.id}>
            <NovelCard novel={novel} />
          </li>
        ))}
    </ul>
  );
};

const NovelCard = ({ novel }: { novel: NovelDetailDTO }) => {
  return (
    <Link
      className="flex w-full gap-4 relative"
      to="/novels/$novelId/chapters"
      params={{
        novelId: novel.id,
      }}
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
          <p className="text-[12px] text-muted-foreground">
            {novel.author ? novel.author.name : "No Author"}
          </p>
          <p className="status block w-fit">{novel.status}</p>
          <p className="line-clamp-3 text-[14px]">{novel.description}</p>
          <div onClick={(e) => e.stopPropagation()}>
            <ProtectedLink
              permissionArgs={{
                resource: "novels",
                action: "update",
              }}
              to="/novels/$novelId"
              params={{ novelId: novel.id }}
              className="absolute top-0 left-0"
            >
              <div className="absolute w-8 h-8">
                <ButtonIcon>
                  <Pencil className="w-full h-full rotate-270" />
                </ButtonIcon>
              </div>
            </ProtectedLink>
          </div>
        </div>
      </div>
    </Link>
  );
};

function SkeletonNovels() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex gap-4">
        <div className="h-36.5 lg:h-45 w-25 lg:w-30 rounded-md animate-pulse skeleton-color" />
        <div className="size-full rounded-md animate-pulse skeleton-color" />
      </div>
      <div className="flex gap-4">
        <div className="h-36.5 lg:h-45 w-25 lg:w-30 rounded-md animate-pulse skeleton-color" />
        <div className="size-full rounded-md animate-pulse skeleton-color" />
      </div>
      <div className="flex gap-4">
        <div className="h-36.5 lg:h-45 w-25 lg:w-30 rounded-md animate-pulse skeleton-color" />
        <div className="size-full rounded-md animate-pulse skeleton-color" />
      </div>
      <div className="flex gap-4">
        <div className="h-36.5 lg:h-45 w-25 lg:w-30 rounded-md animate-pulse skeleton-color" />
        <div className="size-full rounded-md animate-pulse skeleton-color" />
      </div>
      <div className="flex gap-4">
        <div className="h-36.5 lg:h-45 w-25 lg:w-30 rounded-md animate-pulse skeleton-color" />
        <div className="size-full rounded-md animate-pulse skeleton-color" />
      </div>
      <div className="flex gap-4">
        <div className="h-36.5 lg:h-45 w-25 lg:w-30 rounded-md animate-pulse skeleton-color" />
        <div className="size-full rounded-md animate-pulse skeleton-color" />
      </div>
    </div>
  );
}
