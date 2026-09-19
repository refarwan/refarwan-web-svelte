import { env } from "$env/dynamic/public";
import axios from "axios";
import { popup } from "../stores/popup.svelte";
import { getAdminLangCookie } from "../utils/admin-lang-cookie";

import type { AxiosError } from "axios";

interface ErrorResponseData {
    message?: string;
}

export const http = axios.create({
    baseURL: env.PUBLIC_API_URL,
    withCredentials: true
});

http.interceptors.request.use((config) => {
    config.headers.set("Accept-Language", getAdminLangCookie());
    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const message = (error.response?.data as ErrorResponseData | undefined)?.message;
        const status = error.response?.status;
        if (message && status && status >= 500) popup.error({ message });
        return Promise.reject(error);
    }
);
