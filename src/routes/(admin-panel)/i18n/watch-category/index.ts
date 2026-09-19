import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { WatchCategory } from "./types";

export const WATCH_CATEGORY_TRANSLATIONS: Record<AdminLocale, WatchCategory> = {
    "en-US": enUS,
    "id-ID": idID
};
