import { CategoryTable } from "../../db/schemas/index.ts";
import { CreateResourceFactory } from "../factories/create.ts";

export const createCategoryTx = CreateResourceFactory({ table: CategoryTable });
