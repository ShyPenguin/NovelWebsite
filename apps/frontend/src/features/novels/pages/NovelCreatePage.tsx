import { CREATE } from "@/shared/constants";
import { CHAPTER_SEARCH_DEFAULT } from "@/features/chapters/chapter.schema";
import Page from "@/shared/components/Page";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NovelCoverForm } from "../components/form/NovelCoverForm";
import { NovelForm } from "../components/form/NovelForm";

const NovelCreatePage = () => {
  const [novelId, setIsNovelId] = useState("");
  const navigate = useNavigate();
  return (
    <Page>
      <Page.Header title="Create Novel" className="text-center" />
      <Page.Body type={"center"}>
        {!novelId ? (
          <div className="w-full max-w-3xl flex-center relative card ">
            <NovelForm type={CREATE} onClose={(id) => setIsNovelId(id)} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-4 h-full max-h-400 card">
            <h1 className="">Please select an image</h1>
            <NovelCoverForm
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
};

export default NovelCreatePage;
