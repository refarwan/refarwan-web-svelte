import { enUS } from "./en-US";
import { idID } from "./id-ID";
import { jaJP } from "./ja-JP";

import type { ContentLocale } from "../types";
import type { WatchTranslation } from "./types";

export type { WatchTranslation } from "./types";

export const WATCH_TRANSLATIONS: Record<ContentLocale, WatchTranslation> = {
    "en-US": enUS,
    "id-ID": idID,
    "ja-JP": jaJP
};
