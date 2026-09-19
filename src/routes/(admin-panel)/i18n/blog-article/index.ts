import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { BlogArticle } from "./types";

export const BLOG_ARTICLE_TRANSLATIONS: Record<AdminLocale, BlogArticle> = {
    "en-US": enUS,
    "id-ID": idID
};
