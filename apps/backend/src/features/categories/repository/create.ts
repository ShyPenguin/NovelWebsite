import { CategoryTable } from "@/infrastructure/db/schemas/categories.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createCategoryTx = CreateResourceFactory({ table: CategoryTable });
