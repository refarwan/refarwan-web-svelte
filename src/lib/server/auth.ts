import { env } from "$env/dynamic/private";

import type { Cookies } from "@sveltejs/kit";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, mirrors the API's refresh token TTL
const EXPIRY_LEEWAY_MS = 5_000;

const apiUrl = (): string => env.API_URL || "http://localhost:3000";

interface AccessTokenClaims {
    sub: string;
    username: string;
    email: string;
    fullname: string;
    exp: number;
}

const decodeJwtPayload = <T>(token: string): T | null => {
    try {
        const payload = token.split(".")[1];
        const json = Buffer.from(payload, "base64url").toString("utf-8");
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
};

const decodeAccessToken = (token: string): AccessTokenClaims | null =>
    decodeJwtPayload<AccessTokenClaims>(token);

const isExpired = (claims: AccessTokenClaims): boolean =>
    claims.exp * 1000 <= Date.now() + EXPIRY_LEEWAY_MS;

/** The refresh token is itself a JWT, so its real expiry can be read straight off its `exp` claim. */
const decodeJwtExpiry = (token: string): Date | null => {
    const claims = decodeJwtPayload<{ exp: number }>(token);
    return claims ? new Date(claims.exp * 1000) : null;
};

const setAccessTokenCookie = (
    cookies: Cookies,
    accessToken: string,
    expires: Date | null
): void => {
    cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        ...(expires ? { expires } : { maxAge: SESSION_MAX_AGE })
    });
};

const refreshAccessToken = async (
    cookies: Cookies,
    fetchFn: typeof fetch
): Promise<string | null> => {
    const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE);
    if (!refreshToken) return null;

    const res = await fetchFn(`${apiUrl()}/auth/refresh`, {
        headers: { cookie: `refreshToken=${refreshToken}` }
    });
    if (!res.ok) return null;

    const body = (await res.json()) as { data?: { accessToken?: string } };
    const accessToken = body.data?.accessToken;
    if (!accessToken) return null;

    setAccessTokenCookie(cookies, accessToken, decodeJwtExpiry(refreshToken));
    return accessToken;
};

/** Returns a currently-valid access token, transparently refreshing it if needed. */
export const getAccessToken = async (
    cookies: Cookies,
    fetchFn: typeof fetch
): Promise<string | null> => {
    const existing = cookies.get(ACCESS_TOKEN_COOKIE);
    const claims = existing ? decodeAccessToken(existing) : null;

    if (claims && !isExpired(claims)) return existing as string;

    return refreshAccessToken(cookies, fetchFn);
};

export { refreshAccessToken };
