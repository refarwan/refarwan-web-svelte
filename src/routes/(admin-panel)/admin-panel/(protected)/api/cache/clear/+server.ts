import { json } from "@sveltejs/kit";
import { clearApiCache } from "$lib/server/api-data";
import { getRedis } from "$lib/server/redis";

import type { RequestHandler } from "./$types";

const ALLOWED_TAGS = [
    "setting",
    "settings",
    "videos",
    "categories",
    "landing-page",
    "projects",
    "articles"
];

export const POST: RequestHandler = async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn("[CacheClear API] Unauthorized request attempt (missing Bearer token)");
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { tag } = (await request.json()) as { tag?: string };

        if (!tag || !ALLOWED_TAGS.includes(tag)) {
            console.warn(`[CacheClear API] Tag "${tag}" is not in ALLOWED_TAGS:`, ALLOWED_TAGS);
            return json({ error: "Invalid or unauthorized cache tag" }, { status: 400 });
        }

        const redis = await getRedis();
        if (!redis) {
            return json({ error: "Cache service unavailable" }, { status: 503 });
        }

        const clientIp = request.headers.get("x-forwarded-for") || "unknown-ip";
        const rateLimitKey = `ratelimit:clear-cache:${clientIp}:${tag}`;
        const requestCount = await redis.incr(rateLimitKey);

        if (requestCount === 1) {
            await redis.expire(rateLimitKey, 60);
        }

        if (requestCount > 5) {
            return json({ error: "Too many cache clear requests. Please wait." }, { status: 429 });
        }

        console.log(tag);

        await clearApiCache(tag);
        return json({ success: true });
    } catch (error) {
        console.error("Error clearing Redis cache:", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
};
