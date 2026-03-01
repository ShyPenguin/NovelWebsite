import { useEffect, type RefObject } from "react";

type Callback = (event: MouseEvent | TouchEvent) => void;

function useClick<T extends HTMLElement = HTMLElement>({
  ref,
  callbackOutside,
  callbackInside,
}: {
  ref: RefObject<T | null>;
  callbackOutside: Callback;
  callbackInside: Callback;
}): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      // Check if ref exists and event target is OUTSIDE the ref element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackOutside(event);
      }
      // Check if ref exists and event target is INSIDE the ref element
      if (ref.current && ref.current.contains(event.target as Node)) {
        callbackInside(event);
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
  }, [ref, callbackOutside, callbackInside]);
}

export default useClick;
