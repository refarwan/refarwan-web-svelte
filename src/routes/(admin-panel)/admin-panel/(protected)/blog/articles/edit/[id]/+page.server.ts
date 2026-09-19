import { getAdminTranslation } from "$lib/i18n/admin";
import { getActiveContentLangs } from "$lib/server/settings";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { adminLang } = await parent();
    const contentLanguages = await getActiveContentLangs(fetch);

    return {
        t: getAdminTranslation(adminLang).blogArticle,
        editorT: getAdminTranslation(adminLang).blogArticleEditor,
        common: getAdminTranslation(adminLang).common,
        shellT: getAdminTranslation(adminLang).shell,
        contentLanguages
    };
};
