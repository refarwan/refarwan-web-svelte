import type { ImageVariant } from "./image";

export type VideoStatus = "published" | "draft" | "archived";

export interface VideoUploader {
    id: string;
    fullname: string;
}

export interface VideoTranslationItem {
    id: string;
    videoId: string;
    languageCode: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface VideoItem {
    id: string;
    title: string | null;
    status: VideoStatus;
    category: string | null;
    thumbnail: ImageVariant;
    viewsCount: number;
    createdAt: string;
}

export interface VideoDetail extends VideoItem {
    description: string | null;
    duration: number;
    categoryId: string | null;
    uploader: VideoUploader | null;
    p360: string | null;
    p720: string | null;
    p1080: string | null;
    translations: VideoTranslationItem[];
    updatedAt: string;
}

export interface VideoStreamSource {
    quality: number;
    label: string;
    url: string;
}

export interface PublicVideoItem {
    id: string;
    title: string | null;
    thumbnail: ImageVariant;
    viewsCount: number;
    duration: number;
    createdAt: string;
}

export interface PublicVideoDetail extends PublicVideoItem {
    description: string | null;
    category: string | null;
    categorySlug: string | null;
    p360: string | null;
    p720: string | null;
    p1080: string | null;
}

export interface VideoEmbedDetail {
    id: string;
    title: string | null;
    duration: number;
    thumbnail: ImageVariant;
    sources: VideoStreamSource[];
}
