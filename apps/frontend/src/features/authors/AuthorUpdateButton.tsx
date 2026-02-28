import Pencil from "@/assets/icons/Pencil";
import ButtonIcon from "@/components/ButtonIcon";
import Modal from "@/components/Modal";
import type { AuthorDetailDTO } from "@repo/contracts/dto/author";
import { useState } from "react";
import { AuthorForm } from "./AuthorForm";

const AuthorUpdateButton = ({ author }: { author: AuthorDetailDTO }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button onClick={() => setOpenModal(true)}>
        <ButtonIcon>
          <Pencil className="w-5 h-5" />
        </ButtonIcon>
      </button>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <Modal.Header>Update Author</Modal.Header>
          <Modal.Body>
            <div className="size-full">
              <AuthorForm
                type="update"
                author={author}
                onClose={() => setOpenModal(false)}
              />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default AuthorUpdateButton;
