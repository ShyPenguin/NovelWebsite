import type { Resource } from "@repo/contracts/auth/permissions/resource";
import { mapSingularResource } from "@repo/contracts/utils/map-singular-resource";

type NotFoundParams =
  | {
      resource: Resource;
      link?: string;
      root?: never;
    }
  | {
      root: true;
      resource?: never;
      link?: string;
    };
export const NotFound = ({ resource, root, link = "/" }: NotFoundParams) => {
  return (
    <div className="min-h-150 size-full flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>

      {!root ? (
        <p className="text-muted-foreground text-sm">
          {`The ${mapSingularResource[resource]} you're looking for doesn't exist.`}
        </p>
      ) : (
        <p className="text-muted-foreground text-sm">This page doesn't exist</p>
      )}

      <a
        href={link}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
      >
        Go Home
      </a>
    </div>
  );
};
