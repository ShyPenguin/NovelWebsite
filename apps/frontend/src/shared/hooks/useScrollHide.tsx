// hooks/useScrollHide.ts
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

export const useScrollHide = (threshold: number = 200) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous && latest > previous && latest > threshold) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return hidden;
};
