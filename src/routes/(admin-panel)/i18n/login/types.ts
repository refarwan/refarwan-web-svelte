import type { AdminLocale } from "../types";

export type LoginTranslationObjects = {
    title: string;
    subtitle: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    passwordLabel: string;
    submit: string;
    submitting: string;
    identifierRequired: string;
    passwordRequired: string;
};

export type LoginTranslations = Record<AdminLocale, LoginTranslationObjects>;
