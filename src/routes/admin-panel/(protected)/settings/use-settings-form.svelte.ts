import { authorizedHttp } from "$lib/api/authorized-http";
import { CONTENT_LANGUAGES, DEFAULT_THEME_SHADES } from "$lib/constants";
import { popup } from "$lib/stores/popup.svelte";
import { axiosErrorMessage } from "$lib/utils/axios-error-message";
import { generateColorShades } from "$lib/utils/generate-color-shades";
import { useUnsavedChangesGuard } from "$lib/utils/unsaved-changes-guard.svelte";

import type { AdminTranslation } from "$lib/i18n/admin";
import type { AdminSettingsData, DataResponse, ThemeShades } from "$lib/types";

type SettingsT = AdminTranslation["settings"];
type CommonT = AdminTranslation["common"];

interface Snapshot {
    title: string;
    description: string;
    color: string;
    languages: string[];
}

class SettingsFormState {
    loading = $state(true);
    loadError = $state("");

    title = $state("");
    description = $state("");
    faviconPreview = $state("");
    faviconFile: File | null = $state(null);

    selectedColor = $state(DEFAULT_THEME_SHADES["500"]);
    themeShades = $state<ThemeShades>(DEFAULT_THEME_SHADES);
    isThemeChanged = $state(false);

    otherContentLanguages = $state<string[]>([]);

    submitting = $state(false);
    resetting = $state(false);

    private snapshot = $state<Snapshot>({
        title: "",
        description: "",
        color: DEFAULT_THEME_SHADES["500"],
        languages: []
    });

    private getT: () => SettingsT;
    private getCommonT: () => CommonT;

    constructor(getT: () => SettingsT, getCommonT: () => CommonT) {
        this.getT = getT;
        this.getCommonT = getCommonT;

        void this.load();
        useUnsavedChangesGuard(
            () => this.isDirty,
            () => this.getCommonT().unsavedMessage
        );
    }

    private async load() {
        try {
            const res = await authorizedHttp.get<DataResponse<AdminSettingsData>>("/setting");
            const setting = res.data.data;

            this.title = setting.appMetadata.title;
            this.description = setting.appMetadata.description;
            this.faviconPreview = setting.appMetadata.favicon;
            this.selectedColor = setting.theme["500"] ?? DEFAULT_THEME_SHADES["500"];
            this.themeShades = setting.theme;
            this.otherContentLanguages = setting.otherContentLanguages;

            this.snapshot = {
                title: this.title,
                description: this.description,
                color: this.selectedColor,
                languages: [...this.otherContentLanguages]
            };
        } catch (err) {
            this.loadError = axiosErrorMessage(err, this.getT().loadFailed);
        } finally {
            this.loading = false;
        }
    }

    get isDirty(): boolean {
        return (
            this.title !== this.snapshot.title ||
            this.description !== this.snapshot.description ||
            this.faviconFile !== null ||
            this.isThemeChanged ||
            this.selectedColor !== this.snapshot.color ||
            this.otherContentLanguages.join(",") !== this.snapshot.languages.join(",")
        );
    }

    get availableLanguages() {
        return CONTENT_LANGUAGES.filter(
            (lang) => lang.code !== "en" && !this.otherContentLanguages.includes(lang.locale)
        );
    }

    get activeLanguages() {
        return this.otherContentLanguages
            .map((locale) => CONTENT_LANGUAGES.find((lang) => lang.locale === locale))
            .filter((lang) => lang !== undefined);
    }

    onColorChange = (color: string): void => {
        this.selectedColor = color;
        this.isThemeChanged = true;
        const shades = generateColorShades(color);
        if (shades) this.themeShades = shades;
    };

    onAddLanguage = (locale: string): void => {
        if (this.otherContentLanguages.includes(locale)) return;
        this.otherContentLanguages = [...this.otherContentLanguages, locale];
    };

    onRemoveLanguage = (locale: string): void => {
        this.otherContentLanguages = this.otherContentLanguages.filter((code) => code !== locale);
    };

    handleSubmit = async (event: SubmitEvent): Promise<void> => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        if (!this.isThemeChanged) formData.delete("colorCode");
        if (!this.faviconFile) formData.delete("favicon");

        this.submitting = true;
        try {
            await authorizedHttp.put("/setting", formData);
            this.snapshot = {
                title: this.title,
                description: this.description,
                color: this.selectedColor,
                languages: [...this.otherContentLanguages]
            };
            this.faviconFile = null;
            this.isThemeChanged = false;
            popup.success({ message: this.getT().updated });
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, "Update failed") });
        } finally {
            this.submitting = false;
        }
    };

    private submitResetTheme = async (): Promise<void> => {
        this.resetting = true;
        try {
            await authorizedHttp.delete("/setting/theme-shades");
            this.themeShades = DEFAULT_THEME_SHADES;
            this.selectedColor = DEFAULT_THEME_SHADES["500"];
            this.isThemeChanged = false;
            popup.success({ message: this.getT().resetDone });
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, this.getT().resetFailed) });
        } finally {
            this.resetting = false;
        }
    };

    handleResetTheme = (): void => {
        const t = this.getT();
        popup.confirm({
            title: t.resetTitle,
            message: t.resetConfirm,
            confirmText: t.resetDefault,
            cancelText: this.getCommonT().cancel,
            onConfirm: this.submitResetTheme
        });
    };
}

export function useSettingsForm(getT: () => SettingsT, getCommonT: () => CommonT) {
    return new SettingsFormState(getT, getCommonT);
}
