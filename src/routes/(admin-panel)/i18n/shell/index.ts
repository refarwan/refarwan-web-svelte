import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { Shell } from "./types";

export const SHELL_TRANSLATIONS: Record<AdminLocale, Shell> = {
    "en-US": enUS,
    "id-ID": idID
};
