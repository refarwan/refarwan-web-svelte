import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { Project } from "./types";

export const PROJECT_TRANSLATIONS: Record<AdminLocale, Project> = {
    "en-US": enUS,
    "id-ID": idID
};
