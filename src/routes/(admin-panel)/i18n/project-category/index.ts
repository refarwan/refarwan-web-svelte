import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { ProjectCategory } from "./types";

export const PROJECT_CATEGORY_TRANSLATIONS: Record<AdminLocale, ProjectCategory> = {
    "en-US": enUS,
    "id-ID": idID
};
