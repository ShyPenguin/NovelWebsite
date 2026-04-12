import { useLayoutEffect, useState, type RefObject } from "react";

interface Position {
  top: number;
  left: number;
  width: number;
}

interface Props<T> {
  open: boolean;
  triggerRef: RefObject<T>;
  offsetTop?: number;
  offsetLeft?: number;
  width?: number;
}
export const useDropdownPosition = <T extends HTMLElement | null>({
  open,
  triggerRef,
  offsetTop = 0,
  offsetLeft = 0,
  width = 0,
}: Props<T>) => {
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    width: width,
  });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef!.current!.getBoundingClientRect();

      setPosition({
        top: rect.bottom + offsetTop + window.scrollY,
        left: rect.left + offsetLeft + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, triggerRef]);

  return position;
};
