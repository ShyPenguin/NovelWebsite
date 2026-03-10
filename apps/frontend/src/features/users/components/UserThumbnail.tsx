import { NO_IMAGE_URL } from "@/shared/constants";
import type { UserThumbnailDTO } from "@repo/contracts/dto/user";
import { Link } from "@tanstack/react-router";

export const UserThumbnail = (user: UserThumbnailDTO) => {
  return (
    <Link
      className="card flex gap-2 size-full"
      to="/users/$username"
      params={{ username: user.username }}
    >
      <div className="min-w-20 p-2">
        <img
          src={user.imageUrl ?? NO_IMAGE_URL}
          className="h-16 w-16 object-cover rounded-full border-2 border-blue-500"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <p className="truncate">{user.name}</p>
        <p className="truncate">{user.username}</p>
        <p className="truncate">{user.email}</p>
      </div>

      <div className="p-2 shrink-0">
        <p className="status">{user.role}</p>
      </div>
    </Link>
  );
};
