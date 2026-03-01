import type { ReactNode } from "react";

const ButtonIcon = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`text-white dark:text-black hover:text-green-500 cursor-pointer 
            bg-primary-black rounded-full dark:bg-white flex p-2 ${className}`}
    >
      {children}
    </div>
  );
};

export default ButtonIcon;
