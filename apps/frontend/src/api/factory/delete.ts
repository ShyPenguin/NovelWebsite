import { BackendApiLink } from "@/constants";
import type { Resources } from "@/types";
import { idField } from "@/types/fields";
import { ApiResponseSchema } from "@repo/contracts/api";

export const deleteResourceFactory =
  ({ resource }: { resource: Resources }) =>
  async ({ id }: { id: string }): Promise<{ id: string }> => {
    const response = await fetch(`${BackendApiLink}/${resource}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Important for sending JSON data
      },
      credentials: "include",
    });

    const result = await response.json();
    const parsedResult = ApiResponseSchema(idField).parse(result);
    if (!parsedResult.ok) {
      throw new Error(parsedResult.error.message);
    }

    return { id: parsedResult.data };
  };
