import { and, or, SQL } from "drizzle-orm";

export const applyWhere = ({
  q,
  orFilters,
  andFilters,
}: {
  q: any;
  orFilters: SQL[];
  andFilters: SQL[];
}) => {
  if (andFilters.length > 0 && orFilters.length > 0) {
    q.where(and(or(...orFilters), ...andFilters));
  } else if (orFilters.length > 0) {
    q.where(or(...orFilters));
  } else if (andFilters.length > 0) {
    q.where(and(...andFilters));
  }
};
