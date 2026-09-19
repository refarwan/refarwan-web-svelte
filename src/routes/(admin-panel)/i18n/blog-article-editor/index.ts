import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { BlogArticleEditor } from "./types";

export const BLOG_ARTICLE_EDITOR_TRANSLATIONS: Record<AdminLocale, BlogArticleEditor> = {
    "en-US": enUS,
    "id-ID": idID
};
