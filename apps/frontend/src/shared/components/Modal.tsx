import XIcon from "@/assets/icons/XIcon";
import { useLayoutEffect, type ReactNode } from "react";

const Modal = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => {
  useLayoutEffect(() => {
    const { body } = document;
    const originalOverflow = body.style.overflow;

    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = originalOverflow;
    };
  }, []);
  return (
    <div className="modal-background z-300 flex-center p-5">
      <div className="w-fit h-fit  flex-center flex-col gap-4 text-black dark:text-white text-center bg-white dark:bg-primary-black rounded-xl py-8 px-10 relative shadow-xs shadow-white">
        {children}
        <button
          className="absolute top-4 right-4 cursor-pointer text-dark-muted-foreground hover:text-black dark:hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          id="close-modal-top"
        >
          <XIcon className={"h-5 w-5"} />
        </button>
      </div>
    </div>
  );
};

function ModalHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col text-inherit font-semibold text-xl">
      {children}
    </div>
  );
}

function ModalBody({ children }: { children: ReactNode }) {
  return <div className="min-h-15 flex-center flex-col gap-3">{children}</div>;
}

function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex-center gap-8 text-inherit border-inherit">
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
