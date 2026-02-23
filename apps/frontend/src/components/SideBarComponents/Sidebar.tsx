import SideItem from "./SideItem";
import { Link } from "@tanstack/react-router";
import { Discord, House, NovelIcon } from "../../assets/icons/Index";
import UserIcon from "../../assets/icons/UserIcon";
import { DiscordLink } from "../../constants";
import { useSidebarOpen } from "../../stores/AppContext";
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
              to="/about"
              className="[&.active]:font-bold text-inherit text-end py-2 px-4"
              onClick={() => setSideBarOpen(false)}
            >
              About
            </Link>
          </SideItem>

          <SideItem icon={UserIcon}>
            <Link
              to="/profile"
              className="[&.active]:font-bold text-inherit text-end py-2 px-4"
              onClick={() => setSideBarOpen(false)}
            >
              User
            </Link>
          </SideItem>
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
