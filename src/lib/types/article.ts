import type { ImageVariant } from "./image";

export type ArticleStatus = "published" | "draft" | "archived";

export interface ArticleAuthor {
    id: string;
    fullname: string;
}

export interface ArticleTranslationItem {
    id: string;
    articleId: string;
    languageCode: string;
    title: string;
    shortDescription: string;
    contentJSON: unknown;
    contentHTML: string;
    createdAt: string;
    updatedAt: string;
}

export interface ArticleItem {
    id: string;
    title: string | null;
    slug: string;
    shortDescription: string | null;
    status: ArticleStatus;
    category: string | null;
    categoryId: string | null;
    thumbnail: ImageVariant;
    readsCount: number;
    createdAt: string;
}

export interface ArticleDetail extends ArticleItem {
    contentJSON: unknown;
    contentHTML: string;
    author: ArticleAuthor | null;
    translations: ArticleTranslationItem[];
    updatedAt: string;
}

export interface PublicArticleItem {
    id: string;
    title: string | null;
    slug: string;
    shortDescription: string | null;
    category: string | null;
    categorySlug: string | null;
    thumbnail: ImageVariant;
    readsCount: number;
    createdAt: string;
}

export interface PublicArticleDetail extends PublicArticleItem {
    contentJSON: unknown;
    contentHTML: string;
    author: ArticleAuthor | null;
}
