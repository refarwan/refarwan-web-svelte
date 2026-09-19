import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { Dashboard } from "./types";

export const DASHBOARD_TRANSLATIONS: Record<AdminLocale, Dashboard> = {
    "en-US": enUS,
    "id-ID": idID
};
