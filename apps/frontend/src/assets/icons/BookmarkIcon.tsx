const BookmarkIcon = ({ bookmarked = false, ...props }) => {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M70.715 0v512L256 326.715 441.285 512V0H70.715z"
        className={
          bookmarked
            ? "fill-current stroke-white dark:stroke-black"
            : "fill-none stroke-current"
        }
        strokeWidth="24"
      />
    </svg>
  );
};

export default BookmarkIcon;
