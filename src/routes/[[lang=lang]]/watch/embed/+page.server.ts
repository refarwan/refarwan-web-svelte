import { getApiData } from "$lib/server/get-api-data";
import { getSiteLogoUrl } from "$lib/server/site-logo";

import type { PageServerLoad } from "./$types";
import type { DataResponse, VideoEmbedDetail } from "$lib/types";

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
    const videoId = url.searchParams.get("v");
    const headers = { "Accept-Language": locals.locale };

    if (!videoId) {
        return { video: null, logoUrl: "", lang: locals.lang };
    }

    const [videoRes, logoUrl] = await Promise.all([
        getApiData<DataResponse<VideoEmbedDetail>>(
            `video/embed/${videoId}`,
            undefined,
            fetch,
            headers
        ),
        getSiteLogoUrl(fetch)
    ]);

    return { video: videoRes?.data ?? null, logoUrl, lang: locals.lang };
};
