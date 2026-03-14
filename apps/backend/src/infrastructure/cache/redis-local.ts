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
  private prefix: string;
  constructor(client: ReturnType<typeof createClient>, prefix: string) {
    this.client = client;
    this.prefix = prefix;
  }

  async connect() {
    await this.client.connect();
  }
  private key(key: string) {
    return `${this.prefix}${key}`;
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async get<T>(key: string) {
    await this.ensureConnected();

    const raw = await this.client.get(this.key(key));
    return raw ? JSON.parse(raw) : null;
  }

  async set<T>(key: string, value: T, opts?: { ex?: number }) {
    await this.ensureConnected();

    await this.client.set(this.key(key), JSON.stringify(value), {
      EX: opts?.ex,
    });
  }

  async del(key: string) {
    await this.ensureConnected();

    await this.client.del(this.key(key));
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
  const workerId = process.env.VITEST_WORKER_ID ?? "0";

  const client = createClient({
    url: process.env.REDIS_URL,
  });

  await client.connect();

  return new NodeRedisSessionStore(client, `worker:${workerId}:`);
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
