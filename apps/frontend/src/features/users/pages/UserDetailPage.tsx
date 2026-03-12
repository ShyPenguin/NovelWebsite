import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { fetchUserQueryOptions } from "../api/fetchUser";
import Page from "@/shared/components/Page";
import { NO_IMAGE_URL } from "@/shared/constants";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import HorizontalLine from "@/shared/components/HorizontalLine";
import { capitalizeFirstLetter } from "@/shared/utils";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";
import type { NovelThumbnailDTO } from "@repo/contracts/dto/novel";
import { NovelThumbnail } from "@/features/novels/components/NovelThumbnail";
import { Can } from "@/features/auth/components/Can";
import UserUpdateButton from "../components/form/UserUpdateButton";
import { UserChangeRoleButton } from "../components/form/UserChangeRoleButton";
import { UserDeleteButton } from "../components/form/UserDeleteButton";
import { UserImageForm } from "../components/form/UserImageForm";

export const UserDetailPage = () => {
  const route = getRouteApi("/users_/$username/");
  const { username } = route.useParams();
  const { data: user } = useQuery(fetchUserQueryOptions(username));

  return <UserDetail user={user!} />;
};

const UserDetail = ({ user }: { user: UserDetailDTO }) => {
  return (
    <Page>
      <Page.Body type="center">
        {/* PROFILE IMAGE */}
        <div className="min-w-40 p-2 flex flex-col gap-2">
          <UserImageForm
            id={user.id}
            imageUrl={user.imageUrl ?? NO_IMAGE_URL}
          />
          <div className="relative">
            <h3 className="status text-center">{user.role}</h3>
            <Can
              resource="users"
              action="changeRole"
              ctx={{
                data: user,
                payload: { role: "staff" },
              }}
            >
              <UserChangeRoleButton user={user} />
            </Can>
          </div>
          <Can resource="users" action="delete" ctx={{ data: user }}>
            <UserDeleteButton user={user} />
          </Can>
        </div>

        {/* USER DETAILS */}
        <div className="size-full max-w-2xl relative card flex p-2 flex-col gap-2">
          <div>
            <h1 className="truncate wrap-anywhere text-left">
              {user.name}'s profile
            </h1>
            <HorizontalLine />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="truncate">
              Username: <span>{user.username}</span>
            </h3>
            <h3 className="truncate">
              Name: <span>{user.name}</span>
            </h3>
            <h3 className="truncate">
              Email: <span>{user.email}</span>
            </h3>
            <h3 className="truncate">
              {"Logged in with: "}
              <span>
                {user.oAuthProviders.length > 0
                  ? user.oAuthProviders
                      .map((provider) => capitalizeFirstLetter(provider))
                      .join(" ")
                  : " Made by the admin"}
              </span>
            </h3>
            <h3>Created at: {getFormattedDate(user.createdAt)}</h3>
            <h3>Updated at: {getFormattedDate(user.updatedAt)}</h3>
          </div>
          <Can
            resource="users"
            action="update"
            ctx={{
              data: user,
            }}
          >
            <div className="absolute -top-1.25 right-7 lg:right-5">
              <div className="absolute w-8 h-8">
                <UserUpdateButton user={user} />
              </div>
            </div>
          </Can>
        </div>
      </Page.Body>
      <Page.Footer type="center">
        <div className="size-full">
          {user.role !== "user" && <Novels novels={user.novels} />}
        </div>
      </Page.Footer>
    </Page>
  );
};

const Novels = ({ novels }: { novels: NovelThumbnailDTO[] }) => {
  return (
    <>
      <h1 className="pb-2"> Translated Novels:</h1>
      <HorizontalLine className="mb-4" />
      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {novels.length > 0 ? (
          novels.map((novel) => (
            <li key={novel.id}>
              <NovelThumbnail novel={novel} />
            </li>
          ))
        ) : (
          <p>No Novels</p>
        )}
      </ul>
    </>
  );
};
