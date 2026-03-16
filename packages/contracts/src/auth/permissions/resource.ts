import type { UserRole, UserSession } from "../../dto/auth";
import type { AuthorThumbnailDTO } from "../../dto/author";
import type { ChapterAuthDTO } from "../../dto/chapter";
import type { NovelAuthDTO } from "../../dto/novel";
import type { UserThumbnailDTO } from "../../dto/user";

export type PermissionMap = {
  novels: {
    view: { data?: never };
    create: { data?: never };
    update: { data: NovelAuthDTO };
    delete: { data: NovelAuthDTO };
  };

  chapters: {
    view: { data?: never };
    create: { data?: never };
    update: { data: ChapterAuthDTO };
    delete: { data: ChapterAuthDTO };
    preview: { data?: never };
  };

  authors: {
    view: { data?: never };
    create: { data?: never };
    update: { data: { id: AuthorThumbnailDTO["id"] } };
    delete: { data: { id: AuthorThumbnailDTO["id"] } };
  };

  images: {
    view: { data?: never };
    create: { data?: never };
    update: { data: NovelAuthDTO };
    delete: { data: NovelAuthDTO };
  };

  users: {
    view: { data?: never };
    create: { data?: never };
    update: { data: UserThumbnailDTO };
    delete: { data: UserThumbnailDTO };
    changeRole: {
      data: UserThumbnailDTO;
      payload: { role: UserRole };
    };
  };
};

export type Resource = keyof PermissionMap;

export type Action<R extends Resource> = keyof PermissionMap[R];

type PermissionContext<R extends Resource, A extends Action<R>> = {
  user: UserSession;
} & PermissionMap[R][A];

type PermissionFn<R extends Resource, A extends Action<R>> = (
  ctx: PermissionContext<R, A>,
) => boolean;

type PermissionValue<R extends Resource, A extends Action<R>> =
  | boolean
  | PermissionFn<R, A>;

type RolesWithPermissions = {
  [K in UserRole]: {
    [R in Resource]?: {
      [A in Action<R>]?: PermissionValue<R, A>;
    };
  };
};
const ROLES: RolesWithPermissions = {
  admin: {
    novels: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    chapters: {
      view: true,
      create: true,
      update: true,
      delete: true,
      preview: true,
    },
    authors: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    images: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    users: {
      view: true,
      create: true,
      update: ({ user, data }) => {
        return data.role == "admin"
          ? user.id !== data.id
            ? false
            : true
          : true;
      },
      delete: ({ user, data }) => {
        return user.role !== data.role;
      },
      changeRole: ({ user, data }) => {
        return user.role !== data.role;
      },
    },
  },
  supervisor: {
    novels: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    chapters: {
      view: true,
      create: true,
      update: true,
      delete: true,
      preview: true,
    },
    authors: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    images: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    users: {
      view: true,
      update: ({ user, data }) => {
        if (ROLE_RANK[data.role] < ROLE_RANK[user.role]) return false;
        if (data.role == "supervisor" && user.id !== data.id) return false;

        return true;
      },
      delete: ({ user, data }) => {
        if (ROLE_RANK[data.role] < ROLE_RANK[user.role]) return false;
        if (data.role == "supervisor" && user.id !== data.id) return false;

        return true;
      },
      changeRole: ({ user, data, payload }) => {
        if (ROLE_RANK[data.role] <= ROLE_RANK[user.role]) return false;
        if (ROLE_RANK[payload.role] < ROLE_RANK[user.role]) return false;

        return true;
      },
    },
  },
  staff: {
    novels: {
      view: true,
      create: true,
      update: ({ user, data }) => data.translator?.id == user.id,
      delete: ({ user, data }) => data.translator?.id == user.id,
    },
    chapters: {
      view: true,
      create: true,
      update: ({ user, data }) => data.translator?.id == user.id,
      delete: ({ user, data }) => data.translator?.id == user.id,
      preview: true,
    },
    authors: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    images: {
      view: true,
      create: true,
      update: ({ user, data }) => data.translator?.id == user.id,
      delete: ({ user, data }) => data.translator?.id == user.id,
    },
    users: {
      view: true,
      update: ({ user, data }) => user.id == data.id,
      delete: ({ user, data }) => user.id == data.id,
    },
  },
  user: {
    novels: {
      view: true,
    },
    chapters: {
      view: true,
    },
    images: {
      view: true,
    },
    authors: {
      view: true,
    },
    users: {
      view: true,
      update: ({ user, data }) => user.id == data.id,
      delete: ({ user, data }) => user.id == data.id,
    },
  },
};

export function hasPermission<R extends Resource, A extends Action<R>>({
  user,
  resource,
  action,
  ctx,
}:
  | {
      user: UserSession;
      resource: R;
      action: A;
      ctx?: never;
    }
  | {
      user: UserSession;
      resource: R;
      action: A;
      ctx: PermissionMap[R][A];
    }): boolean {
  const permission = ROLES[user.role]?.[resource]?.[action];

  if (!permission) return false;

  if (typeof permission === "boolean") {
    return permission;
  }

  return (
    ctx !== undefined &&
    permission({
      user,
      ...ctx,
    })
  );
}
export const ROLE_RANK = {
  admin: 1,
  supervisor: 2,
  staff: 3,
  user: 4,
} as const satisfies Record<UserRole, number>;
