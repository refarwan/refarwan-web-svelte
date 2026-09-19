import { env } from "$env/dynamic/public";

const apiUrl = (): string => env.PUBLIC_API_URL ?? "";

/** Forwards a browser request for a public /area/* lookup to the API, avoiding CORS. */
export const proxyAreaEndpoint = async (
    fetchFn: typeof fetch,
    path: string,
    search: string
): Promise<Response> => {
    const query = search ? `?${search}` : "";
    const res = await fetchFn(`${apiUrl()}${path}${query}`);

    return new Response(res.body, {
        status: res.status,
        headers: { "content-type": "application/json" }
    });
};
