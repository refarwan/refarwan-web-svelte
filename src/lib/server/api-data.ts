import { env } from "$env/dynamic/public";
import { redis } from "./redis";

export const getApiData = async <T>(
    endpoint: string,
    tag?: string,
    fetchFn: typeof fetch = fetch,
    headers?: HeadersInit
): Promise<T | undefined> => {
    const cacheKey = tag ? `${tag}:${endpoint}` : null;

    try {
        const apiUrl = env.PUBLIC_API_URL || "http://localhost:3000";

        if (cacheKey) {
            const cached = await redis.get(cacheKey);
            if (cached) return JSON.parse(cached) as T | undefined;
        }

        const res = await fetchFn(`${apiUrl}/${endpoint}`, { method: "GET", headers });

        if (!res.ok) {
            if (res.status === 404 && cacheKey)
                await redis.set(cacheKey, JSON.stringify(null), { EX: 3600 });
            return undefined;
        }

        const data = (await res.json()) as T;

        if (cacheKey) await redis.set(cacheKey, JSON.stringify(data));

        return data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const clearApiCache = async (tag: string) => {
    try {
        for await (const key of redis.scanIterator({ MATCH: `${tag}:*` })) {
            await redis.del(key);
        }
    } catch (error) {
        console.error(error);
    }
};
