import { error } from "@sveltejs/kit";
import { getApiData } from "$lib/server/api-data";

import type { DataResponse } from "$lib/types/api-response";
import type { PublicPlaylistDetail } from "$lib/types/playlist";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
    const parentData = await parent();
    const currentLang = parentData.currentLang;
    const slug = params.slug;

    if (!slug) error(404, "Playlist not found");

    const headers = { "Accept-Language": currentLang };

    const playlistRes = await getApiData<DataResponse<PublicPlaylistDetail>>(
        `playlist/public/${slug}`,
        undefined,
        fetch,
        headers
    );

    if (!playlistRes?.data) {
        error(404, "Playlist not found");
    }

    return {
        playlist: playlistRes.data
    };
};
