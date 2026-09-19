// src/lib/server/redis.ts
import { env } from "$env/dynamic/private";
import { createClient } from "redis";

const redisUrl = env.REDIS_URL;
if (!redisUrl) throw Error("REDIS_URL is not defined");

type RedisClientType = ReturnType<typeof createClient>;

// Mencegah multiple instance saat Vite hot module replacement (HMR)
const globalForRedis = globalThis as unknown as { redis?: RedisClientType };

export const redis = globalForRedis.redis ?? createClient({ url: redisUrl });

redis.on("error", (err) => console.error("Redis Client Error", err));

if (!redis.isOpen) {
    await redis.connect();
}

if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}
