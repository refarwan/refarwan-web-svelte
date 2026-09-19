import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { Settings } from "./types";

export const SETTINGS_TRANSLATIONS: Record<AdminLocale, Settings> = {
    "en-US": enUS,
    "id-ID": idID
};
