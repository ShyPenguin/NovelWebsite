import type { FullResponseMap } from "@/shared/types/responseTypes";
import type {
  UserDetailDTO,
  UserFormDTO,
  UserThumbnailDTO,
} from "@repo/contracts/dto/user";

export type UserFormUpdateData = {
  formData: UserFormDTO;
  userId: UserDetailDTO["id"];
};

export type UserResponseMap = {
  detail: UserDetailDTO[];
  thumbnail: UserThumbnailDTO[];
};

export type FetchUsersReturn<T extends keyof FullResponseMap<UserResponseMap>> =
  FullResponseMap<UserResponseMap>[T];
