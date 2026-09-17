import type { ThemeShades } from "./theme-shades";

export interface ImageSource {
    small: string;
    medium: string;
    large: string;
}

export interface AppMetadata {
    faviconPath: string | null;
    faviconUrl: string;
    favicon: string;
    logoPath: unknown;
    logo: ImageSource;
    title: string;
    description: string;
}

export interface PublicSettingsData {
    appMetadata: AppMetadata;
    theme: ThemeShades;
}

export interface AdminSettingsData {
    appMetadata: AppMetadata;
    theme: ThemeShades;
    otherContentLanguages: string[];
}
