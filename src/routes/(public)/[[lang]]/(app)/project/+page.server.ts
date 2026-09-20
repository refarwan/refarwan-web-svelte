import { getApiData } from "$lib/server/api-data";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { PublicProjectItem } from "$lib/types/project";
import type { PublicProjectCategoryItem } from "$lib/types/project-category";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch, parent }) => {
    const parentData = await parent();
    const currentLang = parentData.currentLang;

    const activeCategory = url.searchParams.get("category") ?? "all";
    const page = url.searchParams.get("page") ?? "1";

    const headers = { "Accept-Language": currentLang };

    const query = new URLSearchParams({ page });
    if (activeCategory !== "all") query.set("categorySlug", activeCategory);

    const [categoriesRes, projectsRes] = await Promise.all([
        getApiData<DataResponse<PublicProjectCategoryItem[]>>(
            "project-category/all",
            undefined,
            fetch,
            headers
        ),
        getApiData<ListResponse<PublicProjectItem[]>>(
            `project/all-summary?${query.toString()}`,
            undefined,
            fetch,
            headers
        )
    ]);

    return {
        categories: categoriesRes?.data ?? [],
        projects: projectsRes?.data ?? [],
        currentPage: projectsRes?.currentPage ?? 1,
        totalPage: projectsRes?.totalPage ?? 1,
        activeCategory
    };
};
