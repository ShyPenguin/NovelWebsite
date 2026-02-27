import Searchbar from "../Searchbar";
import { UserIcon } from "../../assets/icons/Index";
import { Profile } from "./Profile";
import { useAuthUIStore } from "../../auth/store/useAuthUIStore";
import { memo } from "react";
import { useAuth } from "@/auth/store/useAuth";

const MemoizedSearchbar = memo(Searchbar);

export const ProfileSearchbar = () => {
  const user = useAuth((s) => s.user);
  const requireLogin = useAuthUIStore((state) => state.requireLogin);

  return (
    <div className="flex size-full gap-4 relative">
      <div className="w-full lg:min-w-50">
        <MemoizedSearchbar />
      </div>
      {user ? (
        <Profile />
      ) : (
        <button className="flex icon-button" onClick={() => requireLogin()}>
          <UserIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
