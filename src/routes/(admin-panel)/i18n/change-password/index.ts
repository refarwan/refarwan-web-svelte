import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { ChangePassword } from "./types";

export const CHANGE_PASSWORD_TRANSLATIONS: Record<AdminLocale, ChangePassword> = {
    "en-US": enUS,
    "id-ID": idID
};
