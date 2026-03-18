import type { UserRole, UserSession } from "@/dto/auth.js";

export type Feature = "usersDirectory" | "novelIndexPage";
type FeaturePermissions = {
  [K in UserRole]?: Partial<Record<Feature, boolean>>;
};

export const ROLE_FEATURES: FeaturePermissions = {
  admin: {
    usersDirectory: true,
    novelIndexPage: true,
  },

  supervisor: {
    usersDirectory: true,
    novelIndexPage: true,
  },

  staff: {
    usersDirectory: true,
    novelIndexPage: true,
  },

  user: {},
};

export function hasFeature(user: UserSession, feature: Feature) {
  return ROLE_FEATURES[user.role]?.[feature] ?? false;
}
