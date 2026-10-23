import type { ImageVariant } from "./image";

export type ImageSource = ImageVariant;

export type PlaylistStatus = "published" | "draft" | "archived";

export interface PlaylistTranslationItem {
    id: string;
    playlistId: string;
    languageCode: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PlaylistVideoItem {
    id: string;
    videoId: string;
    order: number;
    title: string;
    duration: number;
    thumbnail: ImageSource | null;
    status: PlaylistStatus;
    viewsCount: number;
    p360: string | null;
    p720: string | null;
    p1080: string | null;
}

export interface PlaylistItem {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: PlaylistStatus;
    thumbnail: ImageSource | null;
    videoCount: number;
    totalDuration: number;
    createdAt: string;
    updatedAt: string;
}

export interface PlaylistDetail {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: PlaylistStatus;
    thumbnail: ImageSource | null;
    uploader: {
        id: string;
        fullname: string;
    } | null;
    videoCount: number;
    totalDuration: number;
    translations: PlaylistTranslationItem[];
    videos: PlaylistVideoItem[];
    createdAt: string;
    updatedAt: string;
}

export interface PublicPlaylistVideoItem {
    id: string;
    videoId: string;
    order: number;
    title: string;
    duration: number;
    thumbnail: ImageSource | null;
    viewsCount: number;
}

export interface PublicPlaylistItem {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    thumbnail: ImageSource | null;
    videoCount: number;
    totalDuration: number;
    firstVideoId: string | null;
    updatedAt: string;
}

export interface PublicPlaylistDetail {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    thumbnail: ImageSource | null;
    videoCount: number;
    totalDuration: number;
    videos: PublicPlaylistVideoItem[];
    updatedAt: string;
}
