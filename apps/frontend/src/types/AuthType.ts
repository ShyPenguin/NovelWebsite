import type { UserRole } from "@repo/contracts/dto/auth";
export type AuthType = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  imageUrl: string;
};
