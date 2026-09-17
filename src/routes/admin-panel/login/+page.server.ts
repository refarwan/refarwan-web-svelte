import { getAdminTranslation } from "$lib/i18n/admin";
import { getAdminLang } from "$lib/server/admin-lang";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const lang = getAdminLang(cookies);
    return { t: getAdminTranslation(lang).login };
};
