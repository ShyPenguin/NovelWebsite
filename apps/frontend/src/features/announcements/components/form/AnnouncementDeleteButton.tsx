import Trashcan from "@/assets/icons/Trashcan";
import ButtonIcon from "@/shared/components/ButtonIcon";
import Modal from "@/shared/components/Modal";
import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FormButton } from "@/shared/components/Form/FormButton";
import { ANNOUNCEMENT_SEARCH_DEFAULT } from "../../announcement.schema";
import { useAnnouncementDelete } from "../../hooks/useAnnouncementDelete";

export const AnnouncementDeleteButton = ({
  announcement,
}: {
  announcement: AnnouncementDetailDTO;
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
            <p>Are you sure you want to delete this announcement?</p>
          </Modal.Header>
          <Modal.Body>
            <h3>Title: {announcement.title}</h3>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="modal-cancel-button"
              onClick={() => {
                setOpenModal(false);
              }}
              id="delete-form-close-button"
            >
              No, please.
            </button>
            <ConfirmButton
              id={announcement.id}
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
  closeModal,
}: {
  id: AnnouncementDetailDTO["id"];
  closeModal: () => void;
}) => {
  const { mutate, isPending } = useAnnouncementDelete();
  const navigate = useNavigate();
  const handleButtonClick = () => {
    mutate({
      id,
      options: {
        onSuccess: () => {
          closeModal();
          navigate({
            to: "/announcements",
            search: ANNOUNCEMENT_SEARCH_DEFAULT,
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
