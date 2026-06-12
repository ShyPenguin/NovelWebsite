import BookmarkIcon from "@/assets/icons/BookmarkIcon";

type BookmarkProp = {
  bookmarked: boolean;
  onClick: () => void;
};

export const Bookmark = ({ bookmarked, onClick }: BookmarkProp) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <BookmarkIcon
        bookmarked={bookmarked}
        className={`size-6 transition-transform duration-200 ${
          bookmarked ? "scale-animation" : ""
        }`}
      />
    </button>
  );
};
