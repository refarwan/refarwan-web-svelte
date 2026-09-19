import { getAdminTranslation } from "$lib/i18n/admin";
import { setAdminLang } from "$lib/server/admin-lang";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { adminLang } = await parent();

    return {
        t: getAdminTranslation(adminLang).settings,
        common: getAdminTranslation(adminLang).common
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
