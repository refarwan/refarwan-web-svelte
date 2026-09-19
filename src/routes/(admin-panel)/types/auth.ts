export interface AuthUser {
    username: string;
    email: string;
    fullname: string;
}

export interface DecodedAccessToken extends AuthUser {
    sub: string;
    iat: number;
    exp: number;
}

export type AuthCheckResult =
    { status: "unauthenticated" } | { status: "authenticated"; accessToken: string };
