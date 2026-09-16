import { authFetch } from "$lib/server/api-auth";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, cookies, fetch }) => {
    const res = await authFetch(cookies, fetch, `/video/${params.id}`);

    return new Response(res.body, {
        status: res.status,
        headers: { "content-type": "application/json" }
    });
};
