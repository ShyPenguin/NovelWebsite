import { createPortal } from "react-dom";
import { useDropdownPosition } from "../hooks/useDropdownPosition";
import { useAppContext } from "@/app/stores/AppContext";
import { type RefObject } from "react";

interface DropdownPortalProps {
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  offsetTop?: number;
  offsetLeft?: number;
}

export const DropdownPortal = ({
  open,
  triggerRef,
  children,
  className = "",
  offsetTop = 0,
  offsetLeft = 0,
}: DropdownPortalProps) => {
  const { top, left, width } = useDropdownPosition({
    open,
    triggerRef,
    offsetTop,
    offsetLeft,
  });
  const { theme } = useAppContext();
  if (!open) return null;

  return createPortal(
    <div
      className={`${theme ? "" : "dark"} ${className}`}
      style={{
        position: "absolute",
        top,
        left,
        width,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body,
  );
};
