import { Link } from "@tanstack/react-router";
import { AUTHOR_SEARCH_DEFAULT } from "@/features/authors/author.schema";
import Discord from "@/assets/icons/Discord";
import HamburgerMenu from "@/assets/icons/HamburgerMenu";
import { ProfileSearchbar } from "@/app/components/profile-components/ProfileSearchbar";
import { ThemeButton } from "@/app/components/ThemeButton";
import { NOVEL_SEARCH_DEFAULT } from "@/features/novels/novel.schema";
import { LOGO_URL, DiscordLink } from "@/shared/constants";
import { useScrollHide } from "@/shared/hooks/useScrollHide";
import { motion } from "motion/react";
import { useSidebarOpen } from "../stores/AppContext";
import { USER_SEARCH_DEFAULT } from "@/features/users/user.schema";

function Navbar() {
  const { setSideBarOpen } = useSidebarOpen();
  const hidden = useScrollHide(200);
  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 right-0 left-0 z-100 navbar"
    >
      <div className="flex container p-4 gap-2 items-center justify-between text-inherit bg-inherit dark:text-inherit dark:bg-inherit">
        {/* DESKTOP */}
        <div className="hidden lg:flex text-inherit bg-inherit items-center dark:text-inherit dark:bg-inherit w-fit">
          <img src={LOGO_URL} className="logo-img mr-2" />
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/novels" className="nav-link" search={NOVEL_SEARCH_DEFAULT}>
            Novels
          </Link>
          <Link to="/users" className="nav-link" search={USER_SEARCH_DEFAULT}>
            Users
          </Link>
          <Link
            to="/authors"
            className="nav-link"
            search={AUTHOR_SEARCH_DEFAULT}
          >
            Authors
          </Link>
          <div className="py-1">
            <ThemeButton className="icon-button pt-4 pl-2" />
          </div>
          <a
            href={DiscordLink}
            target="_blank"
            className="hidden lg:flex icon-button mt-0.75"
          >
            <Discord className="w-5 h-5" />
          </a>
        </div>

        {/* MOBILE */}
        <div className="flex lg:hidden">
          <button
            className="icon-button hover:cursor-default"
            onClick={() => setSideBarOpen((prev) => !prev)}
          >
            <HamburgerMenu className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        {/* TOP RIGHT */}
        <div className="w-full h-full ml-10 lg:w-fit">
          <ProfileSearchbar />
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
