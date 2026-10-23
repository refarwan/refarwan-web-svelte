import type { AdminLocale } from "../types";

export type ShellTranslationObjects = {
    notFound: string;
    dashboard: string;
    landingPage: string;
    blogArticles: string;
    blogCategories: string;
    blogCreateArticle: string;
    blogImageLibrary: string;
    watchVideos: string;
    watchUploadVideo: string;
    watchCategories: string;
    watchPlaylists: string;
    project: string;
    projectCreateProject: string;
    projectCategories: string;
    myAccount: string;
    changePassword: string;
    settings: string;
    logout: string;
};

export type ShellTranslations = Record<AdminLocale, ShellTranslationObjects>;
