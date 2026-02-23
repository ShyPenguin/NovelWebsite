import { useLayoutEffect, useState } from "react";
import Trashcan from "../../../assets/icons/Trashcan";
import XIcon from "../../../assets/icons/XIcon";
import { FormButton } from "../../../components/Form/FormButton";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { useChapterDelete } from "@/hooks/mutations/chapters-mutation/useChapterDelete";

type DeleteChapterButtonProp = {
  id: ChapterDetailDTO["id"];
  title: ChapterDetailDTO["title"];
  chapterNumber: ChapterDetailDTO["chapterNumber"];
  novelId: ChapterDetailDTO["novelId"];
};
export const DeleteChapterButton = (chapter: DeleteChapterButtonProp) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        className="dark:text-white text-secondary-black hover:text-novelRed cursor-pointer rounded-full p-2 bg-primary-black/5 dark:bg-primary-black/15"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Trashcan className="w-5 h-5" pathClassName="stroke-3" />
      </button>

      {openModal && (
        <DeleteChapterModal
          chapter={chapter}
          closeModal={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

const DeleteChapterModal = ({
  chapter,
  closeModal,
}: {
  chapter: DeleteChapterButtonProp;
  closeModal: () => void;
}) => {
  useLayoutEffect(() => {
    // Save the current overflow value
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="modal-background z-300 flex-center">
      <div className="w-fit h-fit text-white text-center flex-center flex-col gap-4 bg-primary-black rounded-xl py-8 px-10 relative shadow-xs shadow-white">
        <button
          className="absolute top-4 right-4 cursor-pointer text-dark-muted-foreground hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          id="close-modal-top"
        >
          <XIcon className={"h-5 w-5"} />
        </button>
        <h1>Are you sure you want to delete this?:</h1>
        <div>
          <h2>Title: {chapter.title}</h2>
          <p className="text-[14px]">Chapter Number: {chapter.chapterNumber}</p>
        </div>
        <div className="w-full flex-center gap-8">
          <button
            className="size-full flex-center py-2 px-4 rounded-xl border border-white hover:bg-white hover:text-black"
            onClick={() => {
              closeModal();
            }}
            id="delete-form-close-button"
          >
            No, please.
          </button>
          <ConfirmButton
            id={chapter.id}
            novelId={chapter.novelId}
            closeModal={closeModal}
          />
        </div>
      </div>
    </div>
  );
};

const ConfirmButton = ({
  id,
  novelId,
  closeModal,
}: {
  id: ChapterDetailDTO["id"];
  novelId: ChapterDetailDTO["novelId"];
  closeModal: () => void;
}) => {
  const { mutate, isPending } = useChapterDelete({ id, novelId });

  const handleButtonClick = () => {
    mutate({
      options: {
        onSuccess: () => {
          closeModal();
        },
      },
    });
  };

  return (
    <FormButton
      type={"button"}
      isPending={isPending}
      isPendingLabel={"Deleting"}
      label={"Yes, please."}
      handleButton={handleButtonClick}
      className="flex-center gap-2 py-2 px-4 rounded-xl text-novelRed border border-novelRed hover:bg-novelRed hover:text-white"
    />
  );
};
