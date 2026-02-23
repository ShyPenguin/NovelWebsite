import { z } from "zod";

export class StringSchemaBuilder {
  private schema: z.ZodString;
  private fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
    this.schema = z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? `${fieldName} is required`
            : `${fieldName} must be a string`,
      })
      .trim();
  }

  min(value: number) {
    this.schema = this.schema.min(value, {
      message: `${value} ${value == 1 ? "Letter" : "Letters"} minimum for ${this.fieldName.toLowerCase()}`,
    });
    return this;
  }

  max(value: number) {
    this.schema = this.schema.max(value, {
      message: `${value} Letters maximum for ${this.fieldName.toLowerCase()}`,
    });
    return this;
  }

  build() {
    return this.schema;
  }
}
