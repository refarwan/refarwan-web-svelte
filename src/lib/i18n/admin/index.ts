import { enUS } from "./en";
import { idID } from "./id";

import type { AdminLang } from "$lib/types/admin-lang";

import type { AdminTranslation } from "./types";

export type { AdminTranslation } from "./types";

const ADMIN_TRANSLATIONS: Record<AdminLang, AdminTranslation> = {
    "en-US": enUS,
    "id-ID": idID
};

export function getAdminTranslation(lang: AdminLang): AdminTranslation {
    return ADMIN_TRANSLATIONS[lang] ?? ADMIN_TRANSLATIONS["en-US"];
}
