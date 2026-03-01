import Trashcan from "@/assets/icons/Trashcan";
import ButtonIcon from "@/shared/components/ButtonIcon";
import Modal from "@/shared/components/Modal";
import type { AuthorDetailDTO } from "@repo/contracts/dto/author";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthorDelete } from "../hooks/useAuthorDelete";
import { AUTHOR_SEARCH_DEFAULT } from "../author.schema";
import { FormButton } from "@/shared/components/Form/FormButton";

export const AuthorDeleteButton = ({ author }: { author: AuthorDetailDTO }) => {
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
            <p>Are you sure you want to delete this author?</p>
          </Modal.Header>
          <Modal.Body>
            <h3>Name: {author.name}</h3>
            <p className="text-novelRed">
              Deleting this author will result to these novel's author to be
              unknown:
            </p>
            <ul className="grid grid-cols-1 gap-2">
              {author.novels.length > 0 ? (
                author.novels.map((novel) => (
                  <li className="italic max-w-100" key={novel.id}>
                    {novel.title}
                  </li>
                ))
              ) : (
                <p>No Novels</p>
              )}
            </ul>
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
              id={author.id}
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
  id: AuthorDetailDTO["id"];
  closeModal: () => void;
}) => {
  const { mutate, isPending } = useAuthorDelete({ id });
  const navigate = useNavigate();
  const handleButtonClick = () => {
    mutate({
      options: {
        onSuccess: () => {
          closeModal();
          navigate({
            to: "/authors",
            search: AUTHOR_SEARCH_DEFAULT,
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
