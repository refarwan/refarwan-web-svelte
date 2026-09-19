import { setAdminLang } from "$lib/server/admin-lang";
import { COMMON_TRANSLATIONS } from "../../../i18n/common";
import { SETTINGS_TRANSLATIONS } from "../../../i18n/settings";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { currentLang } = await parent();

    return {
        t: SETTINGS_TRANSLATIONS[currentLang],
        common: COMMON_TRANSLATIONS[currentLang]
    };
};

export const actions: Actions = {
    setAdminLang: async ({ request, cookies }) => {
        const raw = await request.formData();
        const lang = raw.get("lang");
        if (lang === "en-US" || lang === "id-ID") setAdminLang(cookies, lang);
        return { success: true };
    }
};
