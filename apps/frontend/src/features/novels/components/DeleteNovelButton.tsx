import Trashcan from "@/assets/icons/Trashcan";
import ButtonIcon from "@/shared/components/ButtonIcon";
import Modal from "@/shared/components/Modal";
import { useNovelDelete } from "@/features/novels/hooks/useNovelDelete";
import { NOVEL_SEARCH_DEFAULT } from "@/features/novels/novel.schema";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FormButton } from "@/shared/components/Form/FormButton";

export const DeleteNovelButton = ({
  id,
  title,
  totalChapters,
}: {
  id: NovelDetailDTO["id"];
  title: NovelDetailDTO["title"];
  totalChapters: NovelDetailDTO["totalChapters"];
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <ButtonIcon className="hover:text-novelRed">
          <Trashcan className="w-5 h-5" pathClassName="stroke-3" />
        </ButtonIcon>
      </button>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <Modal.Header>
            <p>Are you sure you want to delete this novel?</p>
          </Modal.Header>
          <Modal.Body>
            <h3>Title: {title}</h3>
            <p>Chapters: {totalChapters}</p>
            <p className="text-novelRed">
              Deleting this novel will delete all its chapters
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
            <ConfirmButton id={id} closeModal={() => setOpenModal(false)} />
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

const ConfirmButton = ({
  id,
  closeModal,
}: {
  id: NovelDetailDTO["id"];
  closeModal: () => void;
}) => {
  const { mutate, isPending } = useNovelDelete({ id });
  const navigate = useNavigate();
  const handleButtonClick = () => {
    mutate({
      options: {
        onSuccess: () => {
          closeModal();
          navigate({
            to: "/novels",
            search: NOVEL_SEARCH_DEFAULT,
          });
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
