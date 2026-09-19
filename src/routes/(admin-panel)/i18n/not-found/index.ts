import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { NotFound } from "./types";

export const NOT_FOUND_TRANSLATIONS: Record<AdminLocale, NotFound> = {
    "en-US": enUS,
    "id-ID": idID
};
