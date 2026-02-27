import { useState } from "react";
import { NovelFields } from "./NovelFields";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { EDIT } from "@/constants";
import { Chevron } from "@/assets/icons/Chevron";
import Pencil from "@/assets/icons/Pencil";
import { MutateNovelCoverForm } from "@/components/MutateNovelComponents/MutateNovelCoverForm";
import { MutateNovelForm } from "@/components/MutateNovelComponents/MutateNovelForm";
import ButtonIcon from "@/components/ButtonIcon";
import { DeleteNovelButton } from "./DeleteNovelButton";
import Page from "@/components/Page";

export const Content = ({ novel }: { novel: NovelDetailDTO }) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Page.Body type="center">
      <div className="flex-center pb-4">
        <MutateNovelCoverForm
          id={novel.id}
          coverImageUrl={novel.coverImageUrl}
        />
      </div>
      <div className="w-full max-w-3xl relative card ">
        {isEdit ? (
          <MutateNovelForm
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
  );
};
