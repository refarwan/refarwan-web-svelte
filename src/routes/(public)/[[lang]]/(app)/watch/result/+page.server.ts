import { getApiData } from "$lib/server/api-data";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { PublicVideoItem } from "$lib/types/video";
import type { PublicVideoCategoryItem } from "$lib/types/video-category";
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

    const [categoriesRes, videosRes] = await Promise.all([
        getApiData<DataResponse<PublicVideoCategoryItem[]>>(
            "video-category/all",
            undefined,
            fetch,
            headers
        ),
        getApiData<ListResponse<PublicVideoItem[]>>(
            `video/all-summary?${query.toString()}`,
            undefined,
            fetch,
            headers
        )
    ]);

    return {
        categories: categoriesRes?.data ?? [],
        videos: videosRes?.data ?? [],
        currentPage: videosRes?.currentPage ?? 1,
        totalPage: videosRes?.totalPage ?? 1,
        activeCategory,
        search
    };
};
