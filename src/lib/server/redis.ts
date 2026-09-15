// src/lib/server/redis.ts
import Redis from "ioredis";
import { env } from "$env/dynamic/private";

const redisUrl = env.REDIS_URL || "redis://localhost:6379";

// Mencegah multiple instance saat Vite hot module replacement (HMR)
const globalForRedis = globalThis as unknown as { redis?: Redis };

export const redis = globalForRedis.redis ?? new Redis(redisUrl);

if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}
