export interface ProjectCategoryTranslationItem {
    id: string;
    categoryId: string;
    languageCode: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectCategoryItem {
    id: string;
    name: string;
    slug: string;
}

export interface ProjectCategoryDetail {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    translations: ProjectCategoryTranslationItem[];
}

export interface PublicProjectCategoryItem {
    slug: string;
    name: string;
}
