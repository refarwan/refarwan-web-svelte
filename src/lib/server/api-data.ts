import { env } from "$env/dynamic/public";
import { NODE_ENV } from "$env/static/private";
import { getRedis } from "./redis";

const getLangFromHeaders = (headers?: HeadersInit): string | undefined => {
    if (!headers) return undefined;
    if (headers instanceof Headers) {
        return headers.get("Accept-Language") || undefined;
    }
    if (Array.isArray(headers)) {
        const found = headers.find(([k]) => k.toLowerCase() === "accept-language");
        return found ? found[1] : undefined;
    }
    const key = Object.keys(headers).find((k) => k.toLowerCase() === "accept-language");
    return key ? (headers as Record<string, string>)[key] : undefined;
};

export const getApiData = async <T>(
    endpoint: string,
    tag?: string,
    fetchFn: typeof fetch = fetch,
    headers?: HeadersInit
): Promise<T | undefined> => {
    const lang = getLangFromHeaders(headers);
    const cacheKey = tag ? (lang ? `${tag}:${lang}:${endpoint}` : `${tag}:${endpoint}`) : null;
    const isDev = NODE_ENV === "development";

    try {
        const apiUrl = env.PUBLIC_API_URL || "http://localhost:3000";
        const redis = cacheKey ? await getRedis() : null;

        if (redis && cacheKey) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                if (isDev) console.log(`[cache] HIT  ${cacheKey}`);
                return JSON.parse(cached) as T | undefined;
            }
        }

        if (isDev) console.log(`[cache] ${cacheKey ? "MISS" : "SKIP"} ${cacheKey ?? endpoint}`);
        const res = await fetchFn(`${apiUrl}/${endpoint}`, { method: "GET", headers });

        if (!res.ok) {
            if (res.status === 404 && cacheKey && redis)
                await redis.set(cacheKey, JSON.stringify(null), { EX: 3600 });
            return undefined;
        }

        const data = (await res.json()) as T;

        if (redis && cacheKey) await redis.set(cacheKey, JSON.stringify(data));

        return data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const clearApiCache = async (tag: string) => {
    const redis = await getRedis();
    if (!redis) return;

    try {
        for await (const key of redis.scanIterator({ MATCH: `${tag}:*` })) {
            await redis.del(key);
        }
    } catch (error) {
        console.error(error);
    }
};
