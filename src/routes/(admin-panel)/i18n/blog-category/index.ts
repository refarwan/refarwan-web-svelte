import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { BlogCategory } from "./types";

export const BLOG_CATEGORY_TRANSLATIONS: Record<AdminLocale, BlogCategory> = {
    "en-US": enUS,
    "id-ID": idID
};
