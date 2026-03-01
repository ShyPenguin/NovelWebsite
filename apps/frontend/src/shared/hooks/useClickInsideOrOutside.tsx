import { useLayoutEffect, type RefObject } from "react";

type Callback = (event: MouseEvent | TouchEvent) => void;

function useClickInsideOrOutside<T extends HTMLElement = HTMLElement>(
  type: "INSIDE" | "OUTSIDE",
  ref: RefObject<T | null>,
  callback: Callback,
  excludeRef?: RefObject<HTMLElement | null> // Optional ref to exclude
): void {
  useLayoutEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      // Don't trigger if clicking the excluded element
      if (excludeRef?.current?.contains(event.target as Node)) {
        return;
      }

      // Check if ref exists and event target is OUTSIDE the ref element
      if (
        type == "OUTSIDE" &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        callback(event);
      }

      // Check if ref exists and event target is INSIDE the ref element
      if (
        type == "INSIDE" &&
        ref.current &&
        ref.current.contains(event.target as Node)
      ) {
        callback(event);
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref, callback]);
}

export default useClickInsideOrOutside;
