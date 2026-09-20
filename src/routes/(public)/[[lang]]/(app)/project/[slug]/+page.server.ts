import { error } from "@sveltejs/kit";
import { getApiData } from "$lib/server/api-data";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { PublicProjectDetail, PublicProjectItem } from "$lib/types/project";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
    const parentData = await parent();
    const currentLang = parentData.currentLang;

    const { slug } = params;
    const headers = { "Accept-Language": currentLang };

    const projectRes = await getApiData<DataResponse<PublicProjectDetail>>(
        `project/public/${slug}`,
        undefined,
        fetch,
        headers
    );

    if (!projectRes?.data) {
        error(404, "Project not found");
    }

    const project = projectRes.data;

    const relatedRes = project.categorySlug
        ? await getApiData<ListResponse<PublicProjectItem[]>>(
              `project/all-summary?limit=4&categorySlug=${encodeURIComponent(project.categorySlug)}`,
              undefined,
              fetch,
              headers
          )
        : undefined;

    const relatedProjects = (relatedRes?.data ?? [])
        .filter((item) => item.id !== project.id)
        .slice(0, 3);

    return {
        project,
        relatedProjects
    };
};
