import { Profile } from "./Profile";
import { memo } from "react";
import { useAuth } from "@/features/auth/store/useAuth";
import { useAuthUIStore } from "@/features/auth/store/useAuthUIStore";
import { UserIcon } from "@/assets/icons/Index";
import Searchbar from "@/shared/components/Searchbar";

const MemoizedSearchbar = memo(Searchbar);

export const ProfileSearchbar = () => {
  const { data: user } = useAuth();
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
