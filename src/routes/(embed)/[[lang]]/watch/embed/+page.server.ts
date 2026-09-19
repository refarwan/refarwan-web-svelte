import { CONTENT_LANGUAGES, DEFAULT_CONTENT_LANGUAGE } from "$lib/constants/content-language";
import { getApiData } from "$lib/server/api-data";

import type { ContentLocale } from "$lib/i18n/types";
import type { DataResponse } from "$lib/types/api-response";
import type { ImageVariant } from "$lib/types/image";
import type { VideoEmbedDetail } from "$lib/types/video";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params, fetch }) => {
    const currentLang: ContentLocale = (
        CONTENT_LANGUAGES.find((l) => l.locale === params.lang) ?? DEFAULT_CONTENT_LANGUAGE
    ).locale;

    const videoId = url.searchParams.get("v");
    const headers = { "Accept-Language": currentLang };

    if (!videoId) {
        return { video: null, logoUrl: "", currentLang };
    }

    const [videoRes, logoRes] = await Promise.all([
        getApiData<DataResponse<VideoEmbedDetail>>(
            `video/embed/${videoId}`,
            undefined,
            fetch,
            headers
        ),
        getApiData<DataResponse<ImageVariant>>("setting/public/logo", "settings", fetch)
    ]);

    return { video: videoRes?.data ?? null, logoUrl: logoRes?.data.small, currentLang };
};
