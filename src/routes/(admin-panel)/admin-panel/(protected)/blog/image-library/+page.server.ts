import { COMMON_TRANSLATIONS } from "../../../../i18n/common";
import { IMAGE_LIBRARY_TRANSLATIONS } from "../../../../i18n/image-library";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { currentLang } = await parent();

    return {
        t: IMAGE_LIBRARY_TRANSLATIONS[currentLang],
        common: COMMON_TRANSLATIONS[currentLang]
    };
};
