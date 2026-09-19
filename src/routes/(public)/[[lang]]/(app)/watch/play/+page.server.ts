import { error } from "@sveltejs/kit";
import { getApiData } from "$lib/server/api-data";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { PublicVideoDetail, PublicVideoItem } from "$lib/types/video";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch, parent }) => {
    const parentData = await parent();
    const currentLang = parentData.currentLang;

    const videoId = url.searchParams.get("v");
    if (!videoId) error(404, "Video not found");

    const headers = { "Accept-Language": currentLang };

    const [videoRes, recommendedRes] = await Promise.all([
        getApiData<DataResponse<PublicVideoDetail>>(
            `video/${videoId}/public`,
            undefined,
            fetch,
            headers
        ),
        getApiData<ListResponse<PublicVideoItem[]>>(
            "video/all-summary?limit=10",
            undefined,
            fetch,
            headers
        )
    ]);

    if (!videoRes?.data) error(404, "Video not found");

    return {
        video: videoRes.data,
        recommended: (recommendedRes?.data ?? []).filter((item) => item.id !== videoId)
    };
};
