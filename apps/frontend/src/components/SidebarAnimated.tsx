import type { ReactNode } from "react";
import XIcon from "../assets/icons/XIcon";
import { motion } from "motion/react";

export const SidebarAnimated = ({
  children,
  onClose,
  right = true,
}: {
  children: ReactNode;
  onClose: () => void;
  right?: boolean;
}) => {
  return (
    <div className="fixed inset-0 z-200 flex">
      {/* Backdrop with opacity animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 dark:bg-primary-black/75 bg-white/75"
        onClick={onClose}
      />

      {/* Panel with slide animation */}
      <div
        className={`fixed inset-y-0 ${right ? "right-0 pl-10" : "left-0 pr-10"} flex max-w-full`}
      >
        <motion.div
          initial={right ? { x: "100%" } : { x: "-100%" }}
          animate={right ? { x: 0 } : { x: "0%" }}
          exit={right ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-screen max-w-md"
        >
          <div
            className={`absolute ${right ? "left-0 -ml-8 sm:-ml-10 pr-2 sm:pr-4" : "right-0 -mr-8 sm:-mr-10 pl-2 sm:pl-4"} top-0  flex pt-4`}
          >
            <button
              className="rounded-xl text-gray-300 hover:text-black dark:hover:text-white hover:outline-none hover:ring-2 dark:hover:ring-white cursor-pointer"
              onClick={onClose}
            >
              <XIcon className={"h-6 w-6"} />
            </button>
          </div>
          <div className="flex h-full bg-white dark:bg-primary-black shadow-xl ">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
