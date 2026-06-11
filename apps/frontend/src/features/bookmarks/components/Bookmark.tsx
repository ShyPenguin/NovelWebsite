import BookmarkIcon from "@/assets/icons/BookmarkIcon";

type BookmarkProp = {
  bookmarked: boolean;
  onClick: () => void;
};

export const Bookmark = ({ bookmarked, onClick }: BookmarkProp) => {
  return (
    <button onClick={onClick}>
      <BookmarkIcon
        bookmarked={bookmarked}
        className={"fill-current h-6 w-10"}
      />
    </button>
  );
};
