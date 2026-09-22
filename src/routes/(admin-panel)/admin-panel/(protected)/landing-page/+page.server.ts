import { getActiveContentLangs } from "$lib/server/settings";
import { COMMON_TRANSLATIONS } from "../../../i18n/common";
import { LANDING_PAGE_TRANSLATIONS } from "../../../i18n/landing-page";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();
    const contentLanguages = await getActiveContentLangs(fetch);

    return {
        t: LANDING_PAGE_TRANSLATIONS[currentLang] ?? LANDING_PAGE_TRANSLATIONS["en-US"],
        common: COMMON_TRANSLATIONS[currentLang],
        contentLanguages
    };
};
