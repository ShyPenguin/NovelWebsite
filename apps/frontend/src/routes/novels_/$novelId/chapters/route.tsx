import { createFileRoute } from "@tanstack/react-router";
import { novelQueryOptions } from "../../../../api/novels/fetchNovel";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { Content } from "../../../../layouts/chapters/index/Content";

export const Route = createFileRoute("/novels_/$novelId/chapters")({
  loader: ({ context: { queryClient }, params: { novelId } }) => {
    return queryClient.ensureQueryData(novelQueryOptions(novelId));
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Novel" />
    </div>
  ),
  notFoundComponent: () => {
    return <h4 className="test-inherit text-xxs">Novel not found</h4>;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const novel = Route.useLoaderData();

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full absolute overflow-hidden z-0">
        <div className="will-change-transform lg:-translate-y-[50%]">
          <img
            src={
              novel.coverImageUrl ??
              "https://media.reaperscans.net/file/7BSHk1m/w7mrghwwb3zkz6s7t69t2o73.webp"
            }
            className="w-full h-auto blur"
          />
        </div>
      </div>
      <div className="h-72.5 z-10 absolute lg:relative bg-linear-to-b from-0% to-white dark:to-primary-black" />
      <Content novel={novel} />
    </div>
  );
}
