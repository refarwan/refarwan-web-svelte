import type { ImageVariant } from "./image";

export type ProjectStatus = "published" | "draft" | "archived";

export interface ProjectAuthor {
    id: string;
    fullname: string;
}

export interface ProjectTranslationItem {
    id: string;
    projectId: string;
    languageCode: string;
    title: string;
    shortDescription: string;
    contentJSON: unknown;
    contentHTML: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectItem {
    id: string;
    title: string | null;
    slug: string;
    shortDescription: string | null;
    status: ProjectStatus;
    category: string | null;
    categoryId: string | null;
    thumbnail: ImageVariant;
    githubLink: string | null;
    gitlabLink: string | null;
    demoLink: string | null;
    techIcons: string[];
    createdAt: string;
}

export interface ProjectDetail extends ProjectItem {
    contentJSON: unknown;
    contentHTML: string;
    author: ProjectAuthor | null;
    translations: ProjectTranslationItem[];
    updatedAt: string;
}

export interface PublicProjectItem {
    id: string;
    title: string | null;
    slug: string;
    shortDescription: string | null;
    category: string | null;
    categorySlug: string | null;
    thumbnail: ImageVariant;
    githubLink: string | null;
    gitlabLink: string | null;
    demoLink: string | null;
    techIcons: string[];
    createdAt: string;
}

export interface PublicProjectDetail extends PublicProjectItem {
    contentJSON: unknown;
    contentHTML: string;
    author: ProjectAuthor | null;
}
