import { getActiveContentLangs } from "$lib/server/settings";
import { COMMON_TRANSLATIONS } from "../../../../i18n/common";
import { watchPlaylistTranslations } from "../../../../i18n/watch-playlist";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();
    const contentLanguages = await getActiveContentLangs(fetch);

    return {
        t: watchPlaylistTranslations[currentLang],
        common: COMMON_TRANSLATIONS[currentLang],
        contentLanguages,
        currentLang
    };
};
