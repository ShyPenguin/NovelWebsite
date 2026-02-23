import { useQuery } from "@tanstack/react-query";
import { queryAuthOption } from "../../api/auth/auth";
import Searchbar from "../Searchbar";
import { UserIcon } from "../../assets/icons/Index";
import { Profile } from "./Profile";
import { useAuthUIStore } from "../../stores/useAuthUIStore";
import { memo } from "react";

const MemoizedSearchbar = memo(Searchbar);

export const ProfileSearchbar = () => {
  const { isSuccess, data } = useQuery(queryAuthOption());

  const requireLogin = useAuthUIStore((state) => state.requireLogin);

  return (
    <div className="flex size-full gap-4 relative">
      <div className="w-full lg:min-w-[200px]">
        <MemoizedSearchbar />
      </div>

      {/* PROFILE */}
      {!isSuccess ||
        (!data && (
          <button className="flex icon-button" onClick={() => requireLogin()}>
            <UserIcon className="w-5 h-5" />
          </button>
        ))}
      {isSuccess && data && <Profile />}
    </div>
  );
};
