import { getAdminTranslation } from "$lib/i18n/admin";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { adminLang } = await parent();
    return { t: getAdminTranslation(adminLang).shell };
};
