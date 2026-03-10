import Modal from "@/shared/components/Modal";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FormButton } from "@/shared/components/Form/FormButton";
import { USER_SEARCH_DEFAULT } from "../../user.schema";
import { useUserDelete } from "../../hooks/useUserDelete";

export const UserDeleteButton = ({ user }: { user: UserDetailDTO }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <h3 className="status text-novelRed bg-novelRed/20">Delete</h3>
      </button>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <Modal.Header>
            <p>Are you sure you want to delete this user?</p>
          </Modal.Header>
          <Modal.Body>
            <h3>Name: {user.name}</h3>
            <p className="text-novelRed">
              Deleting this user will result to these novel's translator to be
              unknown:
            </p>
            <ul className="grid grid-cols-1 gap-2">
              {user.novels.length > 0 ? (
                user.novels.map((novel) => (
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
              className="modal-cancel-button"
              onClick={() => {
                setOpenModal(false);
              }}
              id="delete-form-close-button"
            >
              No, please.
            </button>
            <ConfirmButton
              id={user.id}
              username={user.username}
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
  username,
  closeModal,
}: {
  id: UserDetailDTO["id"];
  username: UserDetailDTO["username"];
  closeModal: () => void;
}) => {
  const { mutate, isPending } = useUserDelete({ id, username });
  const navigate = useNavigate();
  const handleButtonClick = () => {
    mutate({
      options: {
        onSuccess: () => {
          closeModal();
          navigate({
            to: "/users",
            search: USER_SEARCH_DEFAULT,
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
