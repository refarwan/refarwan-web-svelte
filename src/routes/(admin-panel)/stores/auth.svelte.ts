import { decodeJwt } from "../utils/decode-jwt";

import type { AuthUser } from "../types/auth";

class AuthStore {
    accessToken = $state<string | null>(null);
    initialized = $state(false);
    user = $state<AuthUser | null>(null);

    setAccessToken(token: string): void {
        this.accessToken = token;
        const decoded = decodeJwt(token);
        this.user = decoded
            ? { username: decoded.username, email: decoded.email, fullname: decoded.fullname }
            : null;
        this.initialized = true;
    }

    clear(): void {
        this.accessToken = null;
        this.user = null;
        this.initialized = true;
    }
}

export const authStore = new AuthStore();
