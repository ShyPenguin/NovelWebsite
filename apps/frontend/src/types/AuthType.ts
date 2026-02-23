export type Role = "user" | "admin" | "staff";

export type AuthType = {
  id: string;
  email: string;
  name: string;
  role: Role;
  imageUrl: string;
};
