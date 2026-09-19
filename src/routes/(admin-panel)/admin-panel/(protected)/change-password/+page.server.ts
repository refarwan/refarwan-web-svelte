import { CHANGE_PASSWORD_TRANSLATIONS } from "../../../i18n/change-password";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { currentLang } = await parent();
    return { t: CHANGE_PASSWORD_TRANSLATIONS[currentLang] };
};
