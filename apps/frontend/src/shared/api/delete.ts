import { BackendApiLink } from "@/shared/constants";
import type { Resource } from "@repo/contracts/auth/permissions/resource";

export const deleteResourceFactory =
  ({ resource }: { resource: Resource }) =>
  async ({ id }: { id: string }): Promise<{ id: string }> => {
    const response = await fetch(`${BackendApiLink}/${resource}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Important for sending JSON data
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${resource}`);
    }
    return { id };
  };
