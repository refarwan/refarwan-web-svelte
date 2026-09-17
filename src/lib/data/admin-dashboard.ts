export interface ChartDayData {
    day: string;
    value: number;
    heightPercent: number;
}

export interface AnalyticsCardData {
    title: string;
    description: string;
    days: ChartDayData[];
}

export interface MultilingualText {
    ID: string;
    EN: string;
}

export interface PopularItemThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface PopularItem {
    id: string;
    rank: number;
    title: MultilingualText;
    thumbnail: PopularItemThumbnail;
    countLabel: string;
}

export interface PopularSection {
    title: string;
    buttonLabel: string;
    items: PopularItem[];
}

export const ANALYTICS_DATA: AnalyticsCardData[] = [
    {
        title: "Article Reads",
        description: "Article read counts over the past 7 days",
        days: [
            { day: "Mon", value: 700, heightPercent: 28 },
            { day: "Tue", value: 1100, heightPercent: 44 },
            { day: "Wed", value: 1450, heightPercent: 58 },
            { day: "Thu", value: 2000, heightPercent: 80 },
            { day: "Fri", value: 2350, heightPercent: 94 },
            { day: "Sat", value: 2500, heightPercent: 100 },
            { day: "Sun", value: 2600, heightPercent: 100 }
        ]
    },
    {
        title: "Video Viewers",
        description: "Video viewer counts over the past 7 days",
        days: [
            { day: "Mon", value: 1100, heightPercent: 44 },
            { day: "Tue", value: 1450, heightPercent: 58 },
            { day: "Wed", value: 1250, heightPercent: 50 },
            { day: "Thu", value: 1800, heightPercent: 72 },
            { day: "Fri", value: 2150, heightPercent: 86 },
            { day: "Sat", value: 2000, heightPercent: 80 },
            { day: "Sun", value: 2350, heightPercent: 94 }
        ]
    },
    {
        title: "Project Viewers",
        description: "Project page view statistics",
        days: [
            { day: "Mon", value: 900, heightPercent: 36 },
            { day: "Tue", value: 1250, heightPercent: 50 },
            { day: "Wed", value: 1600, heightPercent: 64 },
            { day: "Thu", value: 2000, heightPercent: 80 },
            { day: "Fri", value: 2350, heightPercent: 94 },
            { day: "Sat", value: 2150, heightPercent: 86 },
            { day: "Sun", value: 2500, heightPercent: 100 }
        ]
    }
];

export const POPULAR_SECTIONS: PopularSection[] = [
    {
        title: "Artikel Terpopuler",
        buttonLabel: "+ Tambah Artikel",
        items: [
            {
                id: "art-1",
                rank: 1,
                title: {
                    ID: "10 Strategi Pertumbuhan untuk SaaS",
                    EN: "10 Growth Strategies for SaaS"
                },
                thumbnail: { url: "/images/blog/blog-1.jpg", width: 48, height: 48 },
                countLabel: "2,847 views"
            },
            {
                id: "art-2",
                rank: 2,
                title: { ID: "Memahami Arsitektur Cloud", EN: "Understanding Cloud Architecture" },
                thumbnail: { url: "/images/blog/blog-2.jpg", width: 48, height: 48 },
                countLabel: "2,103 views"
            },
            {
                id: "art-3",
                rank: 3,
                title: { ID: "Praktik Terbaik Design System", EN: "Design Systems Best Practices" },
                thumbnail: { url: "/images/blog/blog-3.jpg", width: 48, height: 48 },
                countLabel: "1,856 views"
            },
            {
                id: "art-4",
                rank: 4,
                title: { ID: "AI dalam Pengembangan Modern", EN: "AI in Modern Development" },
                thumbnail: { url: "/images/blog/blog-4.jpg", width: 48, height: 48 },
                countLabel: "1,542 views"
            },
            {
                id: "art-5",
                rank: 5,
                title: { ID: "Membangun API yang Skalabel", EN: "Building Scalable APIs" },
                thumbnail: { url: "/images/blog/blog-1.jpg", width: 48, height: 48 },
                countLabel: "1,203 views"
            }
        ]
    },
    {
        title: "Video Terpopuler",
        buttonLabel: "+ Tambah Video",
        items: [
            {
                id: "vid-1",
                rank: 1,
                title: { ID: "Memulai dengan React", EN: "Getting Started with React" },
                thumbnail: { url: "/images/blog/blog-2.jpg", width: 48, height: 48 },
                countLabel: "5,421 viewers"
            },
            {
                id: "vid-2",
                rank: 2,
                title: { ID: "Panduan Lengkap Docker", EN: "Docker Deep Dive" },
                thumbnail: { url: "/images/blog/blog-3.jpg", width: 48, height: 48 },
                countLabel: "3,892 viewers"
            },
            {
                id: "vid-3",
                rank: 3,
                title: { ID: "Dasar-Dasar Desain UI/UX", EN: "UI/UX Design Fundamentals" },
                thumbnail: { url: "/images/blog/blog-4.jpg", width: 48, height: 48 },
                countLabel: "3,201 viewers"
            },
            {
                id: "vid-4",
                rank: 4,
                title: { ID: "Pola Lanjutan TypeScript", EN: "TypeScript Advanced Patterns" },
                thumbnail: { url: "/images/blog/blog-1.jpg", width: 48, height: 48 },
                countLabel: "2,756 viewers"
            },
            {
                id: "vid-5",
                rank: 5,
                title: { ID: "Pengaturan Pipeline DevOps", EN: "DevOps Pipeline Setup" },
                thumbnail: { url: "/images/blog/blog-2.jpg", width: 48, height: 48 },
                countLabel: "2,104 viewers"
            }
        ]
    },
    {
        title: "Project Terpopuler",
        buttonLabel: "+ Tambah Project",
        items: [
            {
                id: "prj-1",
                rank: 1,
                title: { ID: "Redesain Toko E-Commerce", EN: "E-Commerce Redesign" },
                thumbnail: { url: "/images/project-jualkamera.png", width: 48, height: 48 },
                countLabel: "1,892 views"
            },
            {
                id: "prj-2",
                rank: 2,
                title: { ID: "Aplikasi Mobile Banking", EN: "Mobile Banking App" },
                thumbnail: { url: "/images/project-jualkamera.png", width: 48, height: 48 },
                countLabel: "1,654 views"
            },
            {
                id: "prj-3",
                rank: 3,
                title: { ID: "Dasbor Analitik", EN: "Dashboard Analytics" },
                thumbnail: { url: "/images/project-jualkamera.png", width: 48, height: 48 },
                countLabel: "1,423 views"
            },
            {
                id: "prj-4",
                rank: 4,
                title: { ID: "Website Portofolio", EN: "Portfolio Website" },
                thumbnail: { url: "/images/project-jualkamera.png", width: 48, height: 48 },
                countLabel: "1,201 views"
            },
            {
                id: "prj-5",
                rank: 5,
                title: { ID: "Landing Page SaaS", EN: "SaaS Landing Page" },
                thumbnail: { url: "/images/project-jualkamera.png", width: 48, height: 48 },
                countLabel: "987 views"
            }
        ]
    }
];
