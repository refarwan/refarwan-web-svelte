import { getApiData } from "$lib/server/api-data";

import type { ListResponse } from "$lib/types/api-response";
import type { PublicPlaylistItem } from "$lib/types/playlist";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch, parent }) => {
    const parentData = await parent();
    const currentLang = parentData.currentLang;
    const page = url.searchParams.get("page") ?? "1";

    const headers = { "Accept-Language": currentLang };
    const query = new URLSearchParams({ page, limit: "12" });

    const playlistsRes = await getApiData<ListResponse<PublicPlaylistItem[]>>(
        `playlist/public?${query.toString()}`,
        undefined,
        fetch,
        headers
    );

    return {
        playlists: playlistsRes?.data ?? [],
        currentPage: playlistsRes?.currentPage ?? 1,
        totalPage: playlistsRes?.totalPage ?? 1
    };
};
