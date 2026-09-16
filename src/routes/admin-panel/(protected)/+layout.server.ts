import { getAdminTranslation } from "$lib/i18n/admin";
import { getAdminLang } from "$lib/server/admin-lang";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const adminLang = getAdminLang(cookies);
    return { adminLang, shellT: getAdminTranslation(adminLang).shell };
};
