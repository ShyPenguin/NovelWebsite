import { createClient } from "redis";

export interface SessionStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, opts?: { ex?: number }): Promise<void>;
  del(key: string): Promise<void>;
  flushDb(): Promise<void>;
  quit(): Promise<void>;
}

class NodeRedisSessionStore implements SessionStore {
  private client: ReturnType<typeof createClient>;

  constructor(client: ReturnType<typeof createClient>) {
    this.client = client;
  }

  async connect() {
    await this.client.connect();
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async get<T>(key: string) {
    await this.ensureConnected();

    const raw = await this.client.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  async set<T>(key: string, value: T, opts?: { ex?: number }) {
    await this.ensureConnected();

    await this.client.set(key, JSON.stringify(value), {
      EX: opts?.ex,
    });
  }

  async del(key: string) {
    await this.ensureConnected();

    await this.client.del(key);
  }

  async flushDb() {
    await this.ensureConnected();

    await this.client.flushDb();
  }

  async quit() {
    await this.ensureConnected();
    await this.client.quit();
  }
}

export const createRedisSessionStore = async (): Promise<SessionStore> => {
  const client = createClient({
    url: process.env.REDIS_URL,
    database: Number(process.env.VITEST_WORKER_ID ?? 0),
  });

  await client.connect();

  return new NodeRedisSessionStore(client);
};

// In function type
// const NodeRedisSample = async (): Promise<SessionStore> => {
//   const redisClient = createClient({
//     url: process.env.REDIS_URL,
//     database: Number(process.env.VITEST_WORKER_ID ?? 0),
//   });
//   await redisClient.connect();

//   return {
//     get: async (key: string) => {
//       const raw = await redisClient.get(key);
//       return raw ? JSON.parse(raw) : null;
//     },
//     set: async <T>(key: string, value: T, opts?: { ex?: number }) => {
//       await redisClient.set(key, JSON.stringify(value), {
//         EX: opts?.ex,
//       });
//     },
//     del: async (key: string) => {
//       await redisClient.del(key);
//     },
//     flushDb: async () => {
//       await redisClient.flushDb();
//     },
//     quit: async () => {
//       await redisClient.quit();
//     },
//   };
// };
