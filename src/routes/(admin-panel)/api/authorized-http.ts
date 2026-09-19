import { env } from "$env/dynamic/public";
import axios from "axios";
import { authStore } from "../stores/auth.svelte";
import { popup } from "../stores/popup.svelte";
import { getAdminLangCookie } from "../utils/admin-lang-cookie";
import { decodeJwt } from "../utils/decode-jwt";
import { http } from "./http";

import type { AxiosError } from "axios";

interface ErrorResponseData {
    message?: string;
}

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const res = await http.get<{ data: { accessToken: string } }>("/auth/refresh");
        const token = res.data.data.accessToken;
        authStore.setAccessToken(token);
        return token;
    } catch {
        authStore.clear();
        return null;
    }
};

export const ensureAccessToken = async (): Promise<string | null> => {
    const token = authStore.accessToken;
    const decoded = token ? decodeJwt(token) : null;
    const isExpired = !decoded || decoded.exp * 1000 < Date.now();
    if (!token || isExpired) return refreshAccessToken();
    return token;
};

export const authorizedHttp = axios.create({
    baseURL: env.PUBLIC_API_URL,
    withCredentials: true
});

authorizedHttp.interceptors.request.use(async (config) => {
    const token = await ensureAccessToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    config.headers.set("Accept-Language", getAdminLangCookie());
    return config;
});

authorizedHttp.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const message = (error.response?.data as ErrorResponseData | undefined)?.message;
        const status = error.response?.status;
        if (message && status && status >= 500) popup.error({ message });
        return Promise.reject(error);
    }
);
