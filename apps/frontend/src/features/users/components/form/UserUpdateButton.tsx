import Pencil from "@/assets/icons/Pencil";
import ButtonIcon from "@/shared/components/ButtonIcon";
import Modal from "@/shared/components/Modal";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import { useState } from "react";
import { UserForm } from "./UserForm";

const UserUpdateButton = ({ user }: { user: UserDetailDTO }) => {
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
          <Modal.Header>Update User</Modal.Header>
          <Modal.Body>
            <div className="size-full">
              <UserForm user={user} onClose={() => setOpenModal(false)} />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default UserUpdateButton;
