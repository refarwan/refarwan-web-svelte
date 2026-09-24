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
    setPreferredLanguage: async ({ request, cookies }) => {
        const formData = await request.formData();
        const lang = formData.get("admin_preferred_language");

        if (lang === "en-US" || lang === "id-ID") {
            cookies.set("admin_preferred_language", lang, {
                path: "/admin-panel",
                sameSite: "strict"
            });
        }

        return { success: true };
    }
};
