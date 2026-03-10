import type { UserDetailDTO } from "@repo/contracts/dto/user";

export const getUserOneQueryKey = (username: UserDetailDTO["username"]) => {
  return ["user", username];
};

export const getUsersQueryKey = ["users"];

export const getUserUpdateKey = (username: UserDetailDTO["username"]) => {
  return ["user", username, "update"];
};
