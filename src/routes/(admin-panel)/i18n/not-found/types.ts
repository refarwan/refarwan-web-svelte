import type { AdminLocale } from "../types";

export type NotFoundTranslationObjects = {
    heading: string;
    subtext: string;
    backToDashboard: string;
};

export type NotFoundTranslations = Record<AdminLocale, NotFoundTranslationObjects>;
