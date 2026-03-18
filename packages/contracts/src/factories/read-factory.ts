import { z } from "zod";
import { createPaginatedSchema } from "./paginated.js";
import { getDefaultResponses } from "./response.js";

export class GetFactory<T extends z.ZodType> {
  private readonly schema: T;

  constructor({ schema }: { schema: T }) {
    this.schema = schema;
  }

  paginate() {
    return createPaginatedSchema(this.schema);
  }

  array() {
    return z.array(this.schema);
  }

  getSchema() {
    return this.schema;
  }

  getResponses({ type }: { type: "one" | "array" | "paginate" }) {
    switch (type) {
      case "one":
        return getDefaultResponses(this.schema);
      case "array":
        return getDefaultResponses(this.array());
      case "paginate":
        return getDefaultResponses(this.paginate());
      default:
        return getDefaultResponses(this.schema);
    }
  }
}
