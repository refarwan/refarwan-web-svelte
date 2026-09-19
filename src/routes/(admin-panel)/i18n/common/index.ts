import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { Common } from "./types";

export const COMMON_TRANSLATIONS: Record<AdminLocale, Common> = {
    "en-US": enUS,
    "id-ID": idID
};
