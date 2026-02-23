type ChevronProps = {
  isOpen?: boolean;
  className?: string;
  initialRotation?: string;
  isOpenRotation?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
};

export const Chevron = ({
  isOpen = false,
  className = "w-4 h-4 cursor-pointer",
  initialRotation = "",
  isOpenRotation = "rotate-180",
  strokeWidth = 2,
  strokeLinecap = "round",
  strokeLinejoin = "round",
}: ChevronProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-200 ease-in-out ${isOpen ? isOpenRotation : initialRotation}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        strokeWidth={strokeWidth}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};
