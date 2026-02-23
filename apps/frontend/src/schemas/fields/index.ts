import z from "zod";
import { searchField } from "@repo/contracts/fields/general";

export const pageField = z.coerce.number().catch(1).default(1);
export const searchFieldExtend = searchField.catch("").default("");
