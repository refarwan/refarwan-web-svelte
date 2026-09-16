import { redirect } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import type { Cookies } from '@sveltejs/kit';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, mirrors the API's refresh token TTL
const EXPIRY_LEEWAY_MS = 5_000;

const apiUrl = (): string => env.API_URL || 'http://localhost:3000';

interface AccessTokenClaims {
	sub: string;
	username: string;
	email: string;
	fullname: string;
	exp: number;
}

const decodeJwtPayload = <T>(token: string): T | null => {
	try {
		const payload = token.split('.')[1];
		const json = Buffer.from(payload, 'base64url').toString('utf-8');
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

const extractRefreshTokenValue = (setCookieHeader: string | null): string | null => {
	if (!setCookieHeader) return null;
	const match = /refreshToken=([^;]+)/.exec(setCookieHeader);
	return match ? decodeURIComponent(match[1]) : null;
};

const setAccessTokenCookie = (
	cookies: Cookies,
	accessToken: string,
	expires: Date | null
): void => {
	cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		...(expires ? { expires } : { maxAge: SESSION_MAX_AGE })
	});
};

/** Stores the tokens issued by a successful POST /auth/login call. */
export const startSession = (
	cookies: Cookies,
	accessToken: string,
	loginSetCookieHeader: string | null
): void => {
	const refreshToken = extractRefreshTokenValue(loginSetCookieHeader);
	const expires = refreshToken ? decodeJwtExpiry(refreshToken) : null;

	setAccessTokenCookie(cookies, accessToken, expires);

	if (refreshToken) {
		cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			...(expires ? { expires } : { maxAge: SESSION_MAX_AGE })
		});
	}
};

export const endSession = (cookies: Cookies): void => {
	cookies.delete(ACCESS_TOKEN_COOKIE, { path: '/' });
	cookies.delete(REFRESH_TOKEN_COOKIE, { path: '/' });
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

/** Same as getAccessToken, but redirects to the login page instead of returning null. */
export const requireAccessToken = async (
	cookies: Cookies,
	fetchFn: typeof fetch
): Promise<string> => {
	const token = await getAccessToken(cookies, fetchFn);
	if (!token) redirect(303, '/admin-panel/login');
	return token;
};

/** Revokes the session on the API (best-effort) and clears the local session cookies. */
export const logout = async (cookies: Cookies, fetchFn: typeof fetch): Promise<void> => {
	const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);
	const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE);

	if (accessToken) {
		await fetchFn(`${apiUrl()}/auth/logout`, {
			method: 'DELETE',
			headers: {
				authorization: `Bearer ${accessToken}`,
				...(refreshToken ? { cookie: `refreshToken=${refreshToken}` } : {})
			}
		}).catch(() => undefined);
	}

	endSession(cookies);
};

export { refreshAccessToken };
