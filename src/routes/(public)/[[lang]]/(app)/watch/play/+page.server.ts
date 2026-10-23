import { error } from "@sveltejs/kit";
import { getApiData } from "$lib/server/api-data";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { PublicPlaylistDetail } from "$lib/types/playlist";
import type { PublicVideoDetail, PublicVideoItem } from "$lib/types/video";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch, parent }) => {
    const parentData = await parent();
    const currentLang = parentData.currentLang;

    const videoId = url.searchParams.get("v");
    const playlistSlug = url.searchParams.get("list");
    if (!videoId) error(404, "Video not found");

    const headers = { "Accept-Language": currentLang };

    const [videoRes, recommendedRes, playlistRes] = await Promise.all([
        getApiData<DataResponse<PublicVideoDetail>>(
            `video/public/${videoId}`,
            undefined,
            fetch,
            headers
        ),
        getApiData<ListResponse<PublicVideoItem[]>>(
            "video/public/all-summary?limit=10",
            undefined,
            fetch,
            headers
        ),
        playlistSlug
            ? getApiData<DataResponse<PublicPlaylistDetail>>(
                  `playlist/public/${playlistSlug}`,
                  undefined,
                  fetch,
                  headers
              )
            : Promise.resolve(undefined)
    ]);

    if (!videoRes?.data) error(404, "Video not found");

    return {
        video: videoRes.data,
        playlist: playlistRes?.data ?? null,
        recommended: (recommendedRes?.data ?? []).filter((item) => item.id !== videoId)
    };
};
