import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { Login } from "./types";

export const LOGIN_TRANSLATIONS: Record<AdminLocale, Login> = {
    "en-US": enUS,
    "id-ID": idID
};
