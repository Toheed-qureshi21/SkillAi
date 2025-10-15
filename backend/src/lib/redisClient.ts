import { config } from "dotenv";
import RedisDefault from "ioredis";


config();

// TypeScript workaround: cast default import to the constructor type
const Redis = RedisDefault as unknown as new (...args: any[]) => any;

export const redis = new Redis(process.env.REDIS_URL!, {
  db: Number(process.env.REDIS_DB) || 0,
});

redis.on("connect", () => console.log("Redis connected ✅"));
redis.on("error", (err:unknown) => console.error("Redis Client Error:", err));