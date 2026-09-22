import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { LandingPageAdminTranslation } from "./types";

export type { LandingPageAdminTranslation } from "./types";

export const LANDING_PAGE_TRANSLATIONS: Record<string, LandingPageAdminTranslation> = {
    "en-US": enUS,
    "id-ID": idID,
    "ja-JP": enUS // Fallback to English for Admin UI if Japanese is selected as admin language
};
