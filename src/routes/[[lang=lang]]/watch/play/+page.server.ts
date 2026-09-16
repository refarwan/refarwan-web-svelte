import { error } from "@sveltejs/kit";

import { getApiData } from "$lib/server/get-api-data";
import { getSiteLogoUrl } from "$lib/server/site-logo";

import type { PageServerLoad } from "./$types";
import type {
    DataResponse,
    ListResponse,
    PublicSettingsData,
    PublicVideoDetail,
    PublicVideoItem
} from "$lib/types";

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
    const videoId = url.searchParams.get("v");
    if (!videoId) error(404, "Video not found");

    const headers = { "Accept-Language": locals.locale };

    const [videoRes, recommendedRes, logoUrl, publicSettingRes] = await Promise.all([
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
        ),
        getSiteLogoUrl(fetch),
        getApiData<DataResponse<PublicSettingsData>>("setting/public", "settings")
    ]);

    if (!videoRes?.data) error(404, "Video not found");

    return {
        video: videoRes.data,
        recommended: (recommendedRes?.data ?? []).filter((item) => item.id !== videoId),
        logoUrl,
        metadata: publicSettingRes?.data.appMetadata
    };
};
