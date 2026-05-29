import { Profile } from "./Profile";
import { memo, useRef } from "react";
import { useAuth } from "@/features/auth/store/useAuth";
import { useAuthUIStore } from "@/features/auth/store/useAuthUIStore";
import { UserIcon } from "@/assets/icons/Index";
import { Searchbar } from "@/shared/components/Searchbar";

const MemoizedSearchbar = memo(Searchbar);

export const ProfileSearchbar = () => {
  const { data: user } = useAuth();
  const requireLogin = useAuthUIStore((state) => state.requireLogin);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative z-100 flex size-full gap-4" ref={triggerRef}>
      <div className="w-full lg:min-w-50">
        <MemoizedSearchbar triggerRef={triggerRef} />
      </div>
      {user ? (
        <Profile triggerRef={triggerRef} />
      ) : (
        <button className="flex icon-button" onClick={() => requireLogin()}>
          <UserIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
