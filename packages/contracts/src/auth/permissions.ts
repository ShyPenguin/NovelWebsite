import { UserRole, UserSession } from "../dto/auth";
import { AuthorThumbnailDTO } from "../dto/author";
import { ChapterAuthDTO } from "../dto/chapter";
import { NovelDetailDTO, NovelAuthDTO } from "../dto/novel";
import { UserThumbnailDTO } from "../dto/user";

export type Action = "view" | "delete" | "create" | "update" | "preview";

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((
      user: UserSession,
      data: Permissions[Key]["dataType"],
      privilege: boolean,
    ) => boolean);

type RolesWithPermissions = {
  [R in UserRole]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

export type Permissions = {
  novels: {
    dataType: NovelAuthDTO;
    action: Exclude<Action, "preview">;
  };
  chapters: {
    dataType: ChapterAuthDTO;
    action: Action;
  };
  authors: {
    dataType: AuthorThumbnailDTO;
    action: Exclude<Action, "preview">;
  };
  images: {
    dataType: NovelDetailDTO;
    action: Exclude<Action, "preview">;
  };
  users: {
    dataType: UserThumbnailDTO;
    action: Exclude<Action, "preview">;
  };
};

export type Resource = keyof Permissions;

const ROLES = {
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
      update: (user, userToUpdate, privilege) => {
        if (privilege) return userToUpdate.role !== "admin";

        return userToUpdate.role == "admin"
          ? user.id !== userToUpdate.id
            ? false
            : true
          : true;
      },
      delete: (user, userToDelete) => {
        return userToDelete.role !== "admin";
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
      create: true,
      update: (user, userToUpdate, privilege) => {
        if (privilege)
          return !["admin", "supervisor"].includes(userToUpdate.role);

        return userToUpdate.role == "admin" || user.id !== userToUpdate.id
          ? false
          : true;
      },
      delete: (user, userToDelete, privilege) => {
        if (userToDelete.role == "admin") return false;
        if (userToDelete.role == "supervisor" && user.id !== userToDelete.id)
          return false;

        return true;
      },
    },
  },
  staff: {
    novels: {
      view: true,
      create: true,
      update: (user, novel) => novel.translator?.id == user.id,
      delete: (user, novel) => novel.translator?.id == user.id,
    },
    chapters: {
      view: true,
      create: true,
      update: (user, chapter) => chapter.translator?.id == user.id,
      delete: (user, chapter) => chapter.translator?.id == user.id,
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
      update: (user, novel) => novel.translator?.id == user.id,
      delete: (user, novel) => novel.translator?.id == user.id,
    },
    users: {
      view: true,
      create: true,
      update: (user, userToUpdate, privilege) => {
        if (privilege) return false;

        return !["admin", "supervisor"].includes(userToUpdate.role) &&
          user.id !== userToUpdate.id
          ? false
          : true;
      },
      delete: (user, userToDelete, privilege) => {
        return user.id !== userToDelete.id ? false : true;
      },
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
      create: true,
      update: (user, userToUpdate, privilege) => {
        if (privilege) return false;
        return user.id !== userToUpdate.id ? false : true;
      },
      delete: (user, userToDelete) => {
        return userToDelete.role == "admin" || user.id !== userToDelete.id
          ? false
          : true;
      },
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>({
  user,
  resource,
  action,
  data,
  privilege = false,
}: {
  user: UserSession;
  resource: Resource;
  action: Permissions[Resource]["action"];
  data?: Permissions[Resource]["dataType"];
  privilege?: boolean;
}) {
  const permission = (ROLES as RolesWithPermissions)[user.role][resource]?.[
    action
  ];
  if (permission == null) return false;

  if (typeof permission === "boolean") return permission;
  return data != null && permission(user, data, privilege);
}
