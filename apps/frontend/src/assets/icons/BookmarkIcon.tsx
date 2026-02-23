const BookmarkIcon = ({ bookmarked = false, ...props }) => {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={bookmarked ? "scale-animation" : ""}
      {...props}
    >
      {bookmarked ? (
        // Filled bookmark (solid)
        <path d="M70.715 0v512L256 326.715 441.285 512V0H70.715z" />
      ) : (
        // Outline bookmark
        <path d="M70.715 0v512L256 326.715 441.285 512V0H70.715z M411.239 439.462L256 284.224 100.761 439.462V30.046h310.477v409.416z" />
      )}
    </svg>
  );
};

export default BookmarkIcon;
