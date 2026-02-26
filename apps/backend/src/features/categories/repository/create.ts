import { CategoryTable } from "@/infrastructure/db/schemas/categories.ts";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.ts";

export const createCategoryTx = CreateResourceFactory({ table: CategoryTable });
