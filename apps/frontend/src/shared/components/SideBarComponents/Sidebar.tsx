import SideItem from "./SideItem";
import { Link } from "@tanstack/react-router";
import { AUTHOR_SEARCH_DEFAULT } from "@/features/authors/author.schema";
import { NOVEL_SEARCH_DEFAULT } from "@/features/novels/novel.schema";
import Pencil from "@/assets/icons/Pencil";
import { useSidebarOpen } from "@/app/stores/AppContext";
import House from "@/assets/icons/House";
import NovelIcon from "@/assets/icons/NovelIcon";
import { ThemeButton } from "@/app/components/ThemeButton";
import UserIcon from "@/assets/icons/UserIcon";
import { USER_SEARCH_DEFAULT } from "@/features/users/user.schema";
import { Can } from "@/features/auth/components/Can";

function Sidebar() {
  const { setSideBarOpen } = useSidebarOpen();
  return (
    <div className="modal-background z-300 flex size-full">
      <div className="flex h-full min-w-57.5 flex-col justify-between p-8 bg-white dark:bg-primary-black dark:border-r-black rounded-r-2xl shadow-xl shadow-white dark:text-primary-gray">
        <div className="flex flex-col gap-4">
          <SideItem icon={House}>
            <Link
              to="/"
              className="[&.active]:font-bold text-inherit text-end py-2 px-4"
              onClick={() => setSideBarOpen(false)}
            >
              Home
            </Link>
          </SideItem>
          <ThemeButton
            className="side-item py-2 gap-5"
            iconClass="w-6 h-6 pt-1"
            text={true}
          />
          <SideItem icon={NovelIcon}>
            <Link
              to="/novels"
              search={NOVEL_SEARCH_DEFAULT}
              className="[&.active]:font-bold text-inherit text-end py-2 px-4"
              onClick={() => setSideBarOpen(false)}
            >
              Novels
            </Link>
          </SideItem>
          <SideItem icon={Pencil}>
            <Link
              to="/authors"
              search={AUTHOR_SEARCH_DEFAULT}
              className="[&.active]:font-bold text-inherit text-end py-2 px-4"
              onClick={() => setSideBarOpen(false)}
            >
              Authors
            </Link>
          </SideItem>
          <Can feature="usersDirectory">
            <SideItem icon={UserIcon}>
              <Link
                to="/users"
                className="[&.active]:font-bold text-inherit text-end py-2 px-4"
                onClick={() => setSideBarOpen(false)}
                search={USER_SEARCH_DEFAULT}
              >
                User
              </Link>
            </SideItem>
          </Can>
        </div>
        {/* Add Discord Link if you have a link in the future */}
        {/* 
        <div>
          <SideItem icon={Discord}>
            <a
              href={DiscordLink}
              target="_blank"
              className="[&.active]:font-bold text-inherit text-end py-2 px-4"
            >
              Discord
            </a>
          </SideItem>
        </div> */}
      </div>
      <div className="flex size-full" onClick={() => setSideBarOpen(false)} />
    </div>
  );
}

export default Sidebar;
