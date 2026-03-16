import { BackendApiLink } from "@/shared/constants";
import { ApiResponseSchema } from "@repo/contracts/api";
import type { Resource } from "@repo/contracts/auth/permissions/resource";
import { idFieldSchema } from "@repo/contracts/schemas/id";

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

    const result = await response.json();
    const parsedResult = ApiResponseSchema(idFieldSchema).parse(result);
    if (!parsedResult.ok) {
      throw new Error(parsedResult.error.message);
    }

    return { id: parsedResult.data };
  };
