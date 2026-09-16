import { getApiData } from "$lib/server/get-api-data";

import type { PageServerLoad } from "./$types";
import type {
    DataResponse,
    ListResponse,
    PublicVideoCategoryItem,
    PublicVideoItem
} from "$lib/types";

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
    const activeCategory = url.searchParams.get("category") ?? "all";
    const search = url.searchParams.get("search") ?? "";
    const page = url.searchParams.get("page") ?? "1";

    const headers = { "Accept-Language": locals.locale };

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
