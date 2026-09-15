import { fail } from "@sveltejs/kit";

import { getAdminTranslation } from "$lib/i18n/admin";
import { getAdminLang, setAdminLang } from "$lib/server/admin-lang";
import { authFetch, parseApiError } from "$lib/server/api-auth";

import type { Actions, PageServerLoad } from "./$types";

import type { AdminSettingsData, DataResponse } from "$lib/types";
import { clearApiCache } from "$lib/server/get-api-data";

export const load: PageServerLoad = async ({ parent, cookies, fetch }) => {
    const { adminLang } = await parent();

    const res = await authFetch(cookies, fetch, "/setting");
    const setting = res.ok ? ((await res.json()) as DataResponse<AdminSettingsData>).data : null;

    const translation = getAdminTranslation(adminLang);
    return { t: translation.settings, common: translation.common, setting };
};

export const actions: Actions = {
    save: async ({ request, cookies, fetch }) => {
        const raw = await request.formData();
        const output = new FormData();
        output.set("title", String(raw.get("title") ?? ""));
        output.set("description", String(raw.get("description") ?? ""));

        const colorCode = raw.get("colorCode");
        if (typeof colorCode === "string" && colorCode) output.set("colorCode", colorCode);

        const languages = raw.get("otherContentLanguages");
        if (typeof languages === "string") output.set("otherContentLanguages", languages);

        const favicon = raw.get("favicon");
        if (favicon instanceof File && favicon.size > 0) output.set("favicon", favicon);

        const res = await authFetch(cookies, fetch, "/setting", { method: "PUT", body: output });

        const lang = getAdminLang(cookies);
        const t = getAdminTranslation(lang).settings;

        if (!res.ok) {
            const { message } = await parseApiError(res, "Update failed");
            return fail(res.status, { error: message });
        }

        void clearApiCache("settings");

        return { success: true, message: t.updated };
    },

    resetTheme: async ({ cookies, fetch }) => {
        const res = await authFetch(cookies, fetch, "/setting/theme-shades", { method: "DELETE" });

        const lang = getAdminLang(cookies);
        const t = getAdminTranslation(lang).settings;

        if (!res.ok) {
            const { message } = await parseApiError(res, "Reset failed");
            return fail(res.status, { error: message });
        }

        await clearApiCache("settings");
        return { success: true, message: t.resetDone };
    },

    setAdminLang: async ({ request, cookies }) => {
        const raw = await request.formData();
        const lang = raw.get("lang");
        if (lang === "en-US" || lang === "id-ID") setAdminLang(cookies, lang);
        return { success: true };
    }
};
