import { NumberSchemaBuilder } from "@repo/contracts/fields/builders";

export const pageField = new NumberSchemaBuilder("Page").min(1).build();
