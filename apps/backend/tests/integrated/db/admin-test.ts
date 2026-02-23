import { Pool } from "pg";

let adminPool: Pool | null = null;

export const getAdminPool = (): Pool => {
  if (!adminPool) {
    adminPool = new Pool({
      connectionString: process.env.DATABASE_ADMIN_URL,
      connectionTimeoutMillis: 5_000,
      max: 1,
    });
  }

  return adminPool;
};

export const closeAdminPool = async () => {
  if (adminPool) {
    await adminPool.end();
    adminPool = null;
  }
};
