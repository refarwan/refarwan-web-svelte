import { getActiveContentLangs } from "$lib/server/settings";
import { BLOG_ARTICLE_TRANSLATIONS } from "../../../../i18n/blog-article";
import { COMMON_TRANSLATIONS } from "../../../../i18n/common";
import { SHELL_TRANSLATIONS } from "../../../../i18n/shell";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();
    const contentLanguages = await getActiveContentLangs(fetch);

    return {
        t: BLOG_ARTICLE_TRANSLATIONS[currentLang],
        common: COMMON_TRANSLATIONS[currentLang],
        shellT: SHELL_TRANSLATIONS[currentLang],
        contentLanguages
    };
};
