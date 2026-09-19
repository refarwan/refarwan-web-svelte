import { getActiveContentLangs } from "$lib/server/settings";
import { COMMON_TRANSLATIONS } from "../../../../../../i18n/common";
import { WATCH_VIDEO_TRANSLATIONS } from "../../../../../../i18n/watch-video";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();

    const contentLanguages = await getActiveContentLangs(fetch);

    return {
        t: WATCH_VIDEO_TRANSLATIONS[currentLang],
        common: COMMON_TRANSLATIONS[currentLang],
        contentLanguages
    };
};
