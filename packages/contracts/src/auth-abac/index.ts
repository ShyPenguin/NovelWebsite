import { UserRole, UserSession } from "../dto/auth";
import { AuthorDTO } from "../dto/author";
import { ChapterPosterDTO } from "../dto/chapter";
import { NovelDetailDTO, NovelPosterDTO } from "../dto/novel";

export type Action = "view" | "delete" | "create" | "update" | "preview";

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: UserSession, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in UserRole]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

export type Permissions = {
  novels: {
    dataType: NovelPosterDTO;
    action: Exclude<Action, "preview">;
  };
  chapters: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: ChapterPosterDTO;
    action: Action;
  };
  authors: {
    dataType: AuthorDTO;
    action: Exclude<Action, "preview">;
  };
  images: {
    dataType: NovelDetailDTO;
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
    },
    images: {
      update: (user, novel) => novel.translator?.id == user.id,
      delete: (user, novel) => novel.translator?.id == user.id,
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
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>({
  user,
  resource,
  action,
  data,
}: {
  user: UserSession;
  resource: Resource;
  action: Permissions[Resource]["action"];
  data?: Permissions[Resource]["dataType"];
}) {
  const permission = (ROLES as RolesWithPermissions)[user.role][resource]?.[
    action
  ];
  if (permission == null) return false;

  if (typeof permission === "boolean") return permission;
  return data != null && permission(user, data);
}
