import { getActiveContentLangs } from "$lib/server/settings";
import { BLOG_ARTICLE_TRANSLATIONS } from "../../../../i18n/blog-article";
import { BLOG_ARTICLE_EDITOR_TRANSLATIONS } from "../../../../i18n/blog-article-editor";
import { COMMON_TRANSLATIONS } from "../../../../i18n/common";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();
    const contentLanguages = await getActiveContentLangs(fetch);

    return {
        t: BLOG_ARTICLE_TRANSLATIONS[currentLang],
        editorT: BLOG_ARTICLE_EDITOR_TRANSLATIONS[currentLang],
        common: COMMON_TRANSLATIONS[currentLang],
        contentLanguages
    };
};
