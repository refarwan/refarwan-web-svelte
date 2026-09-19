import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { Account } from "./types";

export const ACCOUNT_TRANSLATIONS: Record<AdminLocale, Account> = {
    "en-US": enUS,
    "id-ID": idID
};
