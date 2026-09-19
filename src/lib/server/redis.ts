// src/lib/server/redis.ts
import { env } from "$env/dynamic/private";
import { createClient, type RedisClientType } from "redis";

const globalForRedis = globalThis as unknown as {
    redis?: RedisClientType;
    redisConnecting?: Promise<RedisClientType | null>;
};

// Lazy connect — tidak connect saat module di-import, hanya saat pertama dibutuhkan.
// Aman untuk CI/build time yang tidak punya Redis.
export const getRedis = async (): Promise<RedisClientType | null> => {
    const redisUrl = env.REDIS_URL;
    if (!redisUrl) return null;

    if (globalForRedis.redis?.isOpen) return globalForRedis.redis;

    // Cegah race condition: jika sedang connecting, tunggu promise yang sama
    if (globalForRedis.redisConnecting) return globalForRedis.redisConnecting;

    globalForRedis.redisConnecting = (async () => {
        try {
            const client = createClient({ url: redisUrl });
            client.on("error", (err) => console.error("Redis Client Error", err));
            await client.connect();
            globalForRedis.redis = client;
            return client;
        } catch (err) {
            console.error("Redis connection failed, running without cache:", err);
            return null;
        } finally {
            globalForRedis.redisConnecting = undefined;
        }
    })();

    return globalForRedis.redisConnecting;
};
