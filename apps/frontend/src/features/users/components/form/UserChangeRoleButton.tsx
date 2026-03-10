import Modal from "@/shared/components/Modal";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import { useState } from "react";
import { UserChangeRoleForm } from "./UserChangeRoleForm";

export const UserChangeRoleButton = ({ user }: { user: UserDetailDTO }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="cursor absolute top-0 size-full"
      />
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <Modal.Header>Change User's Role</Modal.Header>
          <Modal.Body>
            <div className="size-full min-w-37.5">
              <UserChangeRoleForm
                user={user}
                onClose={() => setOpenModal(false)}
              />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
