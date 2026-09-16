import { getApiData } from "$lib/server/get-api-data";
import { getSiteLogoUrl } from "$lib/server/site-logo";

import type { PageServerLoad } from "./$types";
import type { DataResponse, VideoEmbedDetail } from "$lib/types";

export const load: PageServerLoad = async ({ url, fetch }) => {
    const videoId = url.searchParams.get("v");

    if (!videoId) {
        return { video: null, logoUrl: "" };
    }

    const [videoRes, logoUrl] = await Promise.all([
        getApiData<DataResponse<VideoEmbedDetail>>(`video/embed/${videoId}`, undefined, fetch),
        getSiteLogoUrl(fetch)
    ]);

    return { video: videoRes?.data ?? null, logoUrl };
};
