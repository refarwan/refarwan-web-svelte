import { getActiveContentLangs } from "$lib/server/settings";
import { BLOG_CATEGORY_TRANSLATIONS } from "../../../../i18n/blog-category";
import { COMMON_TRANSLATIONS } from "../../../../i18n/common";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();
    const contentLanguages = await getActiveContentLangs(fetch);

    return {
        t: BLOG_CATEGORY_TRANSLATIONS[currentLang],
        common: COMMON_TRANSLATIONS[currentLang],
        contentLanguages
    };
};
