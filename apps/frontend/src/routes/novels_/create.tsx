import { MutateNovelCoverForm } from "@/components/MutateNovelComponents/MutateNovelCoverForm";
import { MutateNovelForm } from "@/components/MutateNovelComponents/MutateNovelForm";
import { CREATE } from "@/constants";
import { CHAPTER_SEARCH_DEFAULT } from "@/schemas/chapters";
import { requireRoles } from "@/utils/requireRoles";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/novels_/create")({
  component: RouteComponent,
  beforeLoad: async ({ context: { queryClient } }) => {
    const url = `/novels/create`;
    await requireRoles({
      queryClient,
      roles: ["staff", "admin"],
      location: url,
    });
  },
});

function RouteComponent() {
  const [novelId, setIsNovelId] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-center size-full py-4 px-2">
      <div className="flex items-center md:items-start flex-col size-full max-w-4xl justify-center md:flex-row gap-2">
        {!novelId ? (
          <div className="w-full max-w-3xl flex-center relative card ">
            <MutateNovelForm type={CREATE} onClose={(id) => setIsNovelId(id)} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-4 h-full max-h-400 card">
            <h1 className="">Novel's Cover Image</h1>
            <MutateNovelCoverForm
              id={novelId}
              onClose={() => {
                navigate({
                  to: "/novels/$novelId/chapters",
                  params: { novelId: novelId },
                  search: CHAPTER_SEARCH_DEFAULT,
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
