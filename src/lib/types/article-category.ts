export interface ArticleCategoryTranslationItem {
    id: string;
    categoryId: string;
    languageCode: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface ArticleCategoryItem {
    id: string;
    name: string;
    slug: string;
}

export interface ArticleCategoryDetail {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    translations: ArticleCategoryTranslationItem[];
}

export interface PublicArticleCategoryItem {
    slug: string;
    name: string;
}
