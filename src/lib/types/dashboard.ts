import type { ImageVariant } from "./image";

export interface DashboardStat {
    total: number;
    trend: number;
}

export interface DashboardChartDay {
    day: string;
    value: number;
}

export interface DashboardPopularItem {
    id: string;
    title: string | null;
    thumbnail: ImageVariant | null;
    count: number | null;
    createdAt: string;
}

export interface DashboardSummary {
    articles: DashboardStat;
    videos: DashboardStat;
    projects: DashboardStat;
    articleReadsChart: DashboardChartDay[];
    videoViewsChart: DashboardChartDay[];
    projectsAddedChart: DashboardChartDay[];
    popularArticles: DashboardPopularItem[];
    popularVideos: DashboardPopularItem[];
    latestProjects: DashboardPopularItem[];
}
