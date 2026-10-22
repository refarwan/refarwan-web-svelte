import type { AdminLocale } from "../types";

export type DashboardTranslationObjects = {
    statArticles: string;
    statVideos: string;
    statProjects: string;
    vsLastMonth: string;
    chartArticleReadsTitle: string;
    chartArticleReadsDesc: string;
    chartVideoViewersTitle: string;
    chartVideoViewersDesc: string;
    chartProjectsAddedTitle: string;
    chartProjectsAddedDesc: string;
    popularArticlesTitle: string;
    popularArticlesButton: string;
    popularArticlesCountLabel: string;
    popularVideosTitle: string;
    popularVideosButton: string;
    popularVideosCountLabel: string;
    latestProjectsTitle: string;
    latestProjectsButton: string;
    loading: string;
    noData: string;
};

export type DashboardTranslations = Record<AdminLocale, DashboardTranslationObjects>;
