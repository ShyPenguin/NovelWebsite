import BookmarkIcon from "@/assets/icons/BookmarkIcon";
import { Chevron } from "@/assets/icons/Chevron";
import Gear from "@/assets/icons/Gear";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";
import { logout } from "@/features/auth/api/logout";
import { useAuth } from "@/features/auth/store/useAuth";
import { DropdownPortal } from "@/shared/components/DropdownPortal";
import { NO_IMAGE_URL } from "@/shared/constants";
import useClickInsideOrOutside from "@/shared/hooks/useClickInsideOrOutside";
import { Link } from "@tanstack/react-router";
import {
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
  useLayoutEffect,
  type RefObject,
  forwardRef,
} from "react";

export const Profile = <T extends HTMLDivElement | null>({
  triggerRef,
}: {
  triggerRef: RefObject<T>;
}) => {
  const { data: user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickInsideOrOutside(
    "OUTSIDE",
    dropdownRef,
    () => {
      setIsVisible(false);
    },
    buttonRef,
  );

  useLayoutEffect(() => {
    const handleScroll = () => {
      setIsVisible(false);
    };
    document.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <button
        className="flex justify-center items-center gap-x-2 border border-border dark:border-secondary-black rounded-4xl"
        onClick={() => setIsVisible((prev) => !prev)}
        ref={buttonRef}
      >
        <img
          src={user?.imageUrl ?? NO_IMAGE_URL}
          className="rounded-4xl w-8 h-8 border border-border"
          alt={`${user?.name}'s profile picture`}
        />
        <div
          data-orientation="vertical"
          role="none"
          className="shrink-0 bg-border dark:bg-secondary-black w-px h-8"
        />

        <div className="size-full flex items-center">
          <div className="pr-4">
            <Chevron
              isOpen={isVisible}
              initialRotation="rotate-0"
              isOpenRotation="rotate-180"
              className="w-4 h-4 dark:text-secondary text-secondary-black"
            />
          </div>
        </div>
      </button>

      <DropdownPortal open={isVisible} triggerRef={triggerRef} offsetTop={5}>
        <Content setIsVisible={setIsVisible} ref={dropdownRef} />
      </DropdownPortal>
    </>
  );
};

const Content = forwardRef<
  HTMLUListElement,
  { setIsVisible: Dispatch<SetStateAction<boolean>> }
>(({ setIsVisible }, ref) => {
  const { data: user } = useAuth();
  const handleLogout = async () => {
    await logout();
    setIsVisible(false);
  };
  return (
    <ul
      ref={ref}
      className="flex flex-col w-full h-full p-4 shadow-lg text-primary-black dark:text-white dark:bg-primary-black bg-white border border-border dark:border-secondary-black rounded-2xl"
    >
      <Link to={`/users/$username`} params={{ username: user!.username }}>
        <li className="flex items-center gap-2 border-b border-border dark:border-b-secondary-black px-2 py-4 cursor-pointer hover:bg-black/5 hover:dark:bg-white/5 rounded-md last:border-b-0">
          <BookmarkIcon bookmarked={true} className={"fill-current h-4 w-4"} />
          <p className="text-xs">Bookmarks</p>
        </li>
      </Link>
      <Link to={`/users/$username`} params={{ username: user!.username }}>
        <li className="flex items-center gap-2 border-b border-border dark:border-b-secondary-black px-2 py-4 cursor-pointer hover:bg-black/5 hover:dark:bg-white/5 rounded-md last:border-b-0">
          <Gear className="h-4 w-4" />
          <p className="text-xs">Settings</p>
        </li>
      </Link>
      <li
        className="flex items-center gap-2 border-b border-border dark:border-b-secondary-black px-2 py-4 cursor-pointer hover:bg-black/5 hover:dark:bg-white/5 rounded-md last:border-b-0"
        onClick={handleLogout}
      >
        <LogoutIcon className="h-4 w-4" />
        <p className="text-xs">Logout</p>
      </li>
    </ul>
  );
});
