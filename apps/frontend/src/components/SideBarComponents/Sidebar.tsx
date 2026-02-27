import SideItem from "./SideItem";
import { Link } from "@tanstack/react-router";
import { AUTHOR_SEARCH_DEFAULT } from "@/schemas/authors";
import { NOVEL_SEARCH_DEFAULT } from "@/schemas/novels";
import Pencil from "@/assets/icons/Pencil";
import { useSidebarOpen } from "@/stores/AppContext";
import Discord from "@/assets/icons/Discord";
import House from "@/assets/icons/House";
import NovelIcon from "@/assets/icons/NovelIcon";
import { DiscordLink } from "@/constants";
import { ThemeButton } from "../ThemeButton";

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

          {/* <SideItem icon={UserIcon}>
            <Link
              to="/profile"
              className="[&.active]:font-bold text-inherit text-end py-2 px-4"
              onClick={() => setSideBarOpen(false)}
            >
              User
            </Link>
          </SideItem> */}
        </div>
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
        </div>
      </div>
      <div className="flex size-full" onClick={() => setSideBarOpen(false)} />
    </div>
  );
}

export default Sidebar;
