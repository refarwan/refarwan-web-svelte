import { SHELL_TRANSLATIONS } from "../../i18n/shell";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent }) => {
    const { currentLang } = await parent();
    return { shellT: SHELL_TRANSLATIONS[currentLang] };
};
