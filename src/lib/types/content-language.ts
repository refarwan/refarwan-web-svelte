export type ContentLocale = "en-US" | "id-ID" | "ja-JP";

export interface ContentLanguageSetting {
    code: ContentLocale;
    default: boolean;
}

export interface ContentLanguage {
    locale: ContentLocale;
    name: string;
    flag: string;
    default?: boolean;
}
