import { getApiData } from "$lib/server/api-data";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { PublicArticleItem } from "$lib/types/article";
import type { PublicArticleCategoryItem } from "$lib/types/article-category";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch, parent }) => {
    const parentData = await parent();
    const currentLang = parentData.currentLang;

    const activeCategory = url.searchParams.get("category") ?? "all";
    const search = url.searchParams.get("search")?.trim() ?? "";
    const page = url.searchParams.get("page") ?? "1";

    const headers = { "Accept-Language": currentLang };

    const query = new URLSearchParams({ page });
    if (activeCategory !== "all") query.set("categorySlug", activeCategory);
    if (search) query.set("search", search);

    const [categoriesRes, articlesRes] = await Promise.all([
        getApiData<DataResponse<PublicArticleCategoryItem[]>>(
            "article-category/all",
            undefined,
            fetch,
            headers
        ),
        getApiData<ListResponse<PublicArticleItem[]>>(
            `article/all-summary?${query.toString()}`,
            undefined,
            fetch,
            headers
        )
    ]);

    return {
        categories: categoriesRes?.data ?? [],
        articles: articlesRes?.data ?? [],
        currentPage: articlesRes?.currentPage ?? 1,
        totalPage: articlesRes?.totalPage ?? 1,
        activeCategory,
        search
    };
};
