type ArrowProps = {
  isOpen?: boolean;
  className?: string;
  initialRotation?: string;
  isOpenRotation?: string;
};

const DownArrow = ({
  isOpen = false,
  className = "w-4 h-4 cursor-pointer",
  initialRotation = "",
  isOpenRotation = "rotate-180",
}: ArrowProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="currentColor"
    className={`${className} transition-transform duration-200 ease-in-out ${isOpen ? isOpenRotation : initialRotation}`}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7.5 2a.5.5 0 0 1 .5.5v8.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 1 1 .708-.708L7 11.293V2.5a.5.5 0 0 1 .5-.5Z"
      clipRule="evenodd"
    />
  </svg>
);
export default DownArrow;
