import BookmarkIcon from "@/assets/icons/BookmarkIcon";
import { Chevron } from "@/assets/icons/Chevron";
import Gear from "@/assets/icons/Gear";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";
import { logout } from "@/features/auth/api/logout";
import { useAuth } from "@/features/auth/store/useAuth";
import useClickInsideOrOutside from "@/shared/hooks/useClickInsideOrOutside";
import { useState, useRef, type Dispatch, type SetStateAction } from "react";

export const Profile = () => {
  const user = useAuth((s) => s.user);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickInsideOrOutside(
    "OUTSIDE",
    dropdownRef,
    () => {
      setIsVisible(false);
    },
    buttonRef,
  );

  return (
    <>
      <button
        className="flex size-full justify-center items-center gap-x-2 border border-border dark:border-secondary-black rounded-4xl"
        onClick={() => setIsVisible((prev) => !prev)}
        ref={buttonRef}
      >
        <img
          src={user?.imageUrl}
          className="rounded-4xl w-8 h-8 border border-border"
          alt={`${user?.name}'s profile picture`}
        />
        <div
          data-orientation="vertical"
          role="none"
          className="shrink-0 bg-border dark:bg-secondary-black w-px h-8"
        />

        <div className="size-full flex items-center">
          <Chevron
            isOpen={isVisible}
            initialRotation="rotate-0"
            isOpenRotation="rotate-180"
            className="w-4 h-4 dark:text-secondary text-secondary-black"
          />
        </div>
      </button>

      <div
        ref={dropdownRef}
        className={`absolute top-10 left-0 w-full h-fit transition-all duration-200 ease-in-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <Content setIsVisible={setIsVisible} />
      </div>
    </>
  );
};

const Content = ({
  setIsVisible,
}: {
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleLogout = async () => {
    await logout();
    setIsVisible(false);
  };
  return (
    <ul className="flex flex-col w-full h-full p-4 shadow-lg text-primary-black dark:text-white dark:bg-primary-black bg-white border border-border dark:border-secondary-black rounded-2xl">
      <li className="flex items-center gap-2 border-b border-border dark:border-b-secondary-black px-2 py-4 cursor-pointer hover:bg-black/5 hover:dark:bg-white/5 rounded-md last:border-b-0">
        <BookmarkIcon bookmarked={true} className={"fill-current h-4 w-4"} />
        <p className="text-xs">Bookmarks</p>
      </li>
      <li className="flex items-center gap-2 border-b border-border dark:border-b-secondary-black px-2 py-4 cursor-pointer hover:bg-black/5 hover:dark:bg-white/5 rounded-md last:border-b-0">
        <Gear className="h-4 w-4" />
        <p className="text-xs">Settings</p>
      </li>
      <li
        className="flex items-center gap-2 border-b border-border dark:border-b-secondary-black px-2 py-4 cursor-pointer hover:bg-black/5 hover:dark:bg-white/5 rounded-md last:border-b-0"
        onClick={handleLogout}
      >
        <LogoutIcon className="h-4 w-4" />
        <p className="text-xs">Logout</p>
      </li>
    </ul>
  );
};
