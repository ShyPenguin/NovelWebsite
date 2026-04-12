import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useScrollHide } from "../hooks/useScrollHide";

export const PageNavbar = ({ children }: { children: ReactNode }) => {
  const hidden = useScrollHide(200);

  return (
    <motion.nav
      variants={{
        visible: { y: 60 },
        hidden: { y: -150 },
      }}
      initial={{ y: "100%" }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="fixed top-0 navbar w-full z-90 px-4"
    >
      {children}
    </motion.nav>
  );
};
