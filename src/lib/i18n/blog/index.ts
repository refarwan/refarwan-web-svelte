import { enUS } from "./en-US";
import { idID } from "./id-ID";
import { jaJP } from "./ja-JP";

import type { ContentLocale } from "$lib/i18n/types";
import type { BlogTranslation } from "./types";

export const BLOG_TRANSLATIONS: Record<ContentLocale, BlogTranslation> = {
    "en-US": enUS,
    "id-ID": idID,
    "ja-JP": jaJP
};

export type { BlogTranslation } from "./types";
