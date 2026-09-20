import { getActiveContentLangs } from "$lib/server/settings";
import { COMMON_TRANSLATIONS } from "../../../../i18n/common";
import { PROJECT_CATEGORY_TRANSLATIONS } from "../../../../i18n/project-category";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();
    const contentLanguages = await getActiveContentLangs(fetch);

    return {
        t: PROJECT_CATEGORY_TRANSLATIONS[currentLang],
        common: COMMON_TRANSLATIONS[currentLang],
        contentLanguages
    };
};
