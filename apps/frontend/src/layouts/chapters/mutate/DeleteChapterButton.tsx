import { useState } from "react";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { useChapterDelete } from "@/hooks/mutations/chapters-mutation/useChapterDelete";
import Modal from "@/components/Modal";
import Trashcan from "@/assets/icons/Trashcan";
import { FormButton } from "@/components/Form/FormButton";

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
        <Modal onClose={() => setOpenModal(false)}>
          <Modal.Header>
            <p>Are you sure you want to delete this chapter?</p>
          </Modal.Header>
          <Modal.Body>
            <h3>Title: {chapter.title}</h3>
            <p className="text-[14px]">
              Chapter Number: {chapter.chapterNumber}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="size-full flex-center py-2 px-4 rounded-xl border border-white hover:bg-white hover:text-black"
              onClick={() => {
                setOpenModal(false);
              }}
              id="delete-form-close-button"
            >
              No, please.
            </button>
            <ConfirmButton
              id={chapter.id}
              novelId={chapter.novelId}
              closeModal={() => setOpenModal(false)}
            />
          </Modal.Footer>
        </Modal>
      )}
    </>
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
