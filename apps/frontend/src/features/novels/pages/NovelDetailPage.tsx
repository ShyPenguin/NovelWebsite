import { useState } from "react";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { EDIT } from "@/shared/constants";
import { Chevron } from "@/assets/icons/Chevron";
import Pencil from "@/assets/icons/Pencil";
import { NovelCoverForm } from "@/features/novels/components/forms/NovelCoverForm";
import ButtonIcon from "@/shared/components/ButtonIcon";
import Page from "@/shared/components/Page";
import { NovelForm } from "@/features/novels/components/forms/NovelForm";
import { DeleteNovelButton } from "@/features/novels/components/DeleteNovelButton";
import { NovelFields } from "@/features/novels/components/NovelFields";

export const NovelDetailPage = ({ novel }: { novel: NovelDetailDTO }) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Page>
      <Page.Body type="center">
        <div className="flex-center pb-4">
          <NovelCoverForm id={novel.id} coverImageUrl={novel.coverImageUrl} />
        </div>
        <div className="w-full max-w-3xl relative card ">
          {isEdit ? (
            <NovelForm
              novel={novel}
              type={EDIT}
              onClose={() => setIsEdit(false)}
            />
          ) : (
            <NovelFields novel={novel} />
          )}
          <div className="absolute -top-1.25 right-7 lg:right-5">
            <button
              className="absolute w-8 h-8"
              onClick={() => setIsEdit((prev) => !prev)}
            >
              <ButtonIcon>
                {isEdit ? (
                  <Chevron
                    initialRotation="rotate-270"
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="miter"
                  />
                ) : (
                  <Pencil className="w-full h-full" />
                )}
              </ButtonIcon>
            </button>
          </div>
          <div className="absolute -top-1.25 left-0">
            <div className="absolute w-8 h-8">
              <DeleteNovelButton
                id={novel.id}
                title={novel.title}
                totalChapters={novel.totalChapters}
              />
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
};
