import { eq, type Column, type GetColumnData } from "drizzle-orm";

export const WhereResourceFactory = <TColumn extends Column>({
  tableId,
}: {
  tableId: TColumn;
}) => {
  return (id: GetColumnData<TColumn>) => {
    return eq(tableId, id);
  };
};
// PARENT TABLE
// PARENT TYPE
// CHILD ARG
