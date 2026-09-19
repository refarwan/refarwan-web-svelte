import { DASHBOARD_TRANSLATIONS } from "../../i18n/dashboard";
import { SHELL_TRANSLATIONS } from "../../i18n/shell";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { currentLang } = await parent();
    return {
        t: SHELL_TRANSLATIONS[currentLang],
        dashboardT: DASHBOARD_TRANSLATIONS[currentLang],
        isIndonesian: currentLang === "id-ID"
    };
};
