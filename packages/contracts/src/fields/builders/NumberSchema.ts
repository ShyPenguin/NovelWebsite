import { z, ZodNumber } from "zod";

export class NumberSchemaBuilder {
  private schema: ZodNumber;
  private fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
    this.schema = z.coerce.number({
      message: `${fieldName} must be a number`,
    });
  }

  min(value: number) {
    this.schema = this.schema.min(value, {
      message: `${this.fieldName} is minimum ${value}`,
    });
    return this;
  }

  max(value: number) {
    this.schema = this.schema.max(value, {
      message: `${this.fieldName} is maximum ${value}`,
    });
    return this;
  }

  build() {
    return this.schema;
  }
}
