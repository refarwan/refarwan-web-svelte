import { invalidateAll } from "$app/navigation";
import { CONTENT_LANGUAGES } from "$lib/i18n/content-language";
import { authorizedHttp } from "../../../api/authorized-http";
import { clearFrontendCache } from "../../../api/clear-frontend-cache";
import { DEFAULT_THEME_SHADES } from "../../../constants/theme-shades";
import { popup } from "../../../stores/popup.svelte";
import { axiosErrorMessage } from "../../../utils/axios-error-message";
import { generateColorShades } from "../../../utils/generate-color-shades";
import { useUnsavedChangesGuard } from "../../../utils/unsaved-changes-guard.svelte";

import type { DataResponse } from "$lib/types/api-response";
import type {
    ContentLanguage,
    ContentLanguageSetting,
    ContentLocale
} from "$lib/types/content-language";
import type { AdminSettingsData } from "$lib/types/setting";
import type { ThemeShades } from "$lib/types/theme-shades";
import type { CommonTranslationObjects } from "../../../i18n/common/types";
import type { SettingsTranslationObjects } from "../../../i18n/settings/types";

type SettingsT = SettingsTranslationObjects;
type CommonT = CommonTranslationObjects;

interface Snapshot {
    title: string;
    description: string;
    color: string;
    languages: string[];
    contentLanguages: ContentLanguageSetting[];
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

    contentLanguages = $state<ContentLanguageSetting[]>([{ code: "en-US", default: true }]);
    otherContentLanguages = $state<string[]>([]);

    submitting = $state(false);
    resetting = $state(false);

    private snapshot = $state<Snapshot>({
        title: "",
        description: "",
        color: DEFAULT_THEME_SHADES["500"],
        languages: [],
        contentLanguages: [{ code: "en-US", default: true }]
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

            if (setting.contentLanguages && setting.contentLanguages.length > 0) {
                const list = setting.contentLanguages;
                const defaultIndex = list.findIndex((l) => l.default);
                if (defaultIndex > 0) {
                    const defaultItem = { ...list[defaultIndex], default: true };
                    const others = list
                        .filter((_, idx) => idx !== defaultIndex)
                        .map((l) => ({ ...l, default: false }));
                    this.contentLanguages = [defaultItem, ...others];
                } else if (defaultIndex === -1 && list.length > 0) {
                    this.contentLanguages = [
                        { ...list[0], default: true },
                        ...list.slice(1).map((l) => ({ ...l, default: false }))
                    ];
                } else {
                    this.contentLanguages = list;
                }
            } else {
                const others = setting.otherContentLanguages ?? [];
                this.contentLanguages = [
                    { code: "en-US", default: true },
                    ...others.map((code) => ({ code: code as ContentLocale, default: false }))
                ];
            }
            this.otherContentLanguages = this.contentLanguages
                .filter((l) => !l.default)
                .map((l) => l.code);

            this.snapshot = {
                title: this.title,
                description: this.description,
                color: this.selectedColor,
                languages: [...this.otherContentLanguages],
                contentLanguages: JSON.parse(JSON.stringify(this.contentLanguages))
            };
        } catch (err) {
            this.loadError = axiosErrorMessage(err, this.getT().loadFailed);
        } finally {
            this.loading = false;
        }
    }

    get isDirty(): boolean {
        const currentLangStr = JSON.stringify(this.contentLanguages);
        const snapshotLangStr = JSON.stringify(this.snapshot.contentLanguages);
        return (
            this.title !== this.snapshot.title ||
            this.description !== this.snapshot.description ||
            this.faviconFile !== null ||
            this.isThemeChanged ||
            this.selectedColor !== this.snapshot.color ||
            currentLangStr !== snapshotLangStr
        );
    }

    get availableLanguages(): ContentLanguage[] {
        const activeCodes = new Set(this.contentLanguages.map((l) => l.code));
        return CONTENT_LANGUAGES.filter((lang) => !activeCodes.has(lang.locale));
    }

    get activeLanguages(): ContentLanguage[] {
        const list: ContentLanguage[] = [];
        for (const item of this.contentLanguages) {
            const info = CONTENT_LANGUAGES.find((lang) => lang.locale === item.code);
            if (info) {
                list.push({
                    ...info,
                    default: item.default
                });
            }
        }
        return list;
    }

    onColorChange = (color: string): void => {
        this.selectedColor = color;
        this.isThemeChanged = true;
        const shades = generateColorShades(color);
        if (shades) this.themeShades = shades;
    };

    onAddLanguage = (locale: string): void => {
        if (this.contentLanguages.some((l) => l.code === locale)) return;
        this.contentLanguages = [
            ...this.contentLanguages,
            { code: locale as ContentLocale, default: false }
        ];
        this.otherContentLanguages = this.contentLanguages
            .filter((l) => !l.default)
            .map((l) => l.code);
    };

    onRemoveLanguage = (locale: string): void => {
        const target = this.contentLanguages.find((l) => l.code === locale);
        if (target?.default) return; // Cannot remove default language
        this.contentLanguages = this.contentLanguages.filter((l) => l.code !== locale);
        this.otherContentLanguages = this.contentLanguages
            .filter((l) => !l.default)
            .map((l) => l.code);
    };

    onSetDefaultLanguage = (locale: string): void => {
        const target = this.contentLanguages.find((l) => l.code === locale);
        if (!target) return;
        const defaultItem: ContentLanguageSetting = { code: target.code, default: true };
        const others = this.contentLanguages
            .filter((l) => l.code !== locale)
            .map((l) => ({ ...l, default: false }));

        this.contentLanguages = [defaultItem, ...others];
        this.otherContentLanguages = others.map((l) => l.code);
    };

    handleSubmit = async (event: SubmitEvent): Promise<void> => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        if (!this.isThemeChanged) formData.delete("colorCode");
        if (!this.faviconFile) formData.delete("favicon");

        formData.set("contentLanguages", JSON.stringify(this.contentLanguages));
        formData.set("otherContentLanguages", JSON.stringify(this.otherContentLanguages));

        this.submitting = true;
        try {
            await authorizedHttp.put("/setting", formData);
            this.snapshot = {
                title: this.title,
                description: this.description,
                color: this.selectedColor,
                languages: [...this.otherContentLanguages],
                contentLanguages: JSON.parse(JSON.stringify(this.contentLanguages))
            };
            this.faviconFile = null;
            this.isThemeChanged = false;
            popup.success({ message: this.getT().updated });
            await clearFrontendCache("settings");
            await invalidateAll();
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
            await clearFrontendCache("settings");
            await invalidateAll();
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
