import type { AdminLocale } from "../types";

export type ChangePasswordTranslationObjects = {
    title: string;
    description: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    save: string;
    saving: string;
    oldPasswordRequired: string;
    newPasswordMinLength: string;
    confirmPasswordRequired: string;
    confirmPasswordMismatch: string;
    updated: string;
};

export type ChangePasswordTranslations = Record<AdminLocale, ChangePasswordTranslationObjects>;
