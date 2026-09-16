export interface VideoCategoryTranslationItem {
    id: string;
    categoryId: string;
    languageCode: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface VideoCategoryItem {
    id: string;
    name: string;
    slug: string;
    videoCount: number;
}

export interface VideoCategoryDetail {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    translations: VideoCategoryTranslationItem[];
}

export interface AdminOptionItem {
    id: string;
    name: string;
}

export interface SlugCheckResult {
    slug: string;
}

export interface PublicVideoCategoryItem {
    slug: string;
    name: string;
}
