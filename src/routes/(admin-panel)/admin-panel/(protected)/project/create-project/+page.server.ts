import { getActiveContentLangs } from "$lib/server/settings";
import { BLOG_ARTICLE_EDITOR_TRANSLATIONS } from "../../../../i18n/blog-article-editor";
import { COMMON_TRANSLATIONS } from "../../../../i18n/common";
import { PROJECT_TRANSLATIONS } from "../../../../i18n/project";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();
    const contentLanguages = await getActiveContentLangs(fetch);

    const contentPlaceholder =
        currentLang === "id-ID"
            ? "Mulai menulis konten proyek..."
            : "Start writing project content...";

    return {
        t: PROJECT_TRANSLATIONS[currentLang],
        editorT: { ...BLOG_ARTICLE_EDITOR_TRANSLATIONS[currentLang], contentPlaceholder },
        common: COMMON_TRANSLATIONS[currentLang],
        contentLanguages
    };
};
