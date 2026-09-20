import { enUS } from "./en-US";
import { idID } from "./id-ID";
import { jaJP } from "./ja-JP";

import type { ContentLocale } from "$lib/i18n/types";
import type { ProjectTranslation } from "./types";

export const PROJECT_TRANSLATIONS: Record<ContentLocale, ProjectTranslation> = {
    "en-US": enUS,
    "id-ID": idID,
    "ja-JP": jaJP
};

export type { ProjectTranslation } from "./types";
