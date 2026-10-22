import type { AdminLocale } from "../types";

export type CommonTranslationObjects = {
    cancel: string;
    unsavedTitle: string;
    unsavedMessage: string;
    leave: string;
    stay: string;
};

export type CommonTranslations = Record<AdminLocale, CommonTranslationObjects>;
