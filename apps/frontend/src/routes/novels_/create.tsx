import { MutateNovelCoverForm } from "@/components/MutateNovelComponents/MutateNovelCoverForm";
import { MutateNovelForm } from "@/components/MutateNovelComponents/MutateNovelForm";
import Page from "@/components/Page";
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
    <Page>
      <Page.Header title="Create Novel" className="text-center" />
      <Page.Body type={"center"}>
        {!novelId ? (
          <div className="w-full max-w-3xl flex-center relative card ">
            <MutateNovelForm type={CREATE} onClose={(id) => setIsNovelId(id)} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-4 h-full max-h-400 card">
            <h1 className="">Please select an image</h1>
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
      </Page.Body>
    </Page>
  );
}
