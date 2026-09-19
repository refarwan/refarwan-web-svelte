import { error } from "@sveltejs/kit";
import { getApiData } from "$lib/server/api-data";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { PublicArticleDetail, PublicArticleItem } from "$lib/types/article";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
    const parentData = await parent();
    const currentLang = parentData.currentLang;

    const { categorySlug, slug } = params;
    const headers = { "Accept-Language": currentLang };

    const articleRes = await getApiData<DataResponse<PublicArticleDetail>>(
        `article/public/${categorySlug}/${slug}`,
        undefined,
        fetch,
        headers
    );

    if (!articleRes?.data) {
        error(404, "Article not found");
    }

    const article = articleRes.data;

    // Fetch related articles in the same category
    const relatedRes = await getApiData<ListResponse<PublicArticleItem[]>>(
        `article/all-summary?limit=4&categorySlug=${encodeURIComponent(categorySlug)}`,
        undefined,
        fetch,
        headers
    );

    const relatedArticles = (relatedRes?.data ?? [])
        .filter((item) => item.id !== article.id)
        .slice(0, 3);

    return {
        article,
        relatedArticles
    };
};
