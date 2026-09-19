import type { Cookies } from "@sveltejs/kit";

const ADMIN_LANG_COOKIE = "admin_lang";

export type AdminLang = "en-US" | "id-ID";

export const setAdminLang = (cookies: Cookies, lang: AdminLang): void => {
    cookies.set(ADMIN_LANG_COOKIE, lang, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365
    });
};
