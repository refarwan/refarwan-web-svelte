import { DEFAULT_CONTENT_LANGUAGE } from "$lib/constants/content-language";
import { getApiData } from "$lib/server/api-data.js";
import { getActiveContentLangs } from "$lib/server/settings.js";

import type { ContentLocale } from "$lib/i18n/types.js";
import type { DataResponse } from "$lib/types/api-response";

interface Metadata {
    title: string;
    description: string;
}

export const load = async ({ params, fetch }) => {
    const [settingRes, contentLanguages] = await Promise.all([
        getApiData<DataResponse<Metadata>>("setting/public/metadata", "settings", fetch),
        getActiveContentLangs(fetch)
    ]);

    const currentLang: ContentLocale = (
        contentLanguages.find((l) => l.locale === params.lang) ?? DEFAULT_CONTENT_LANGUAGE
    ).locale;

    const metadata: Metadata = {
        title: settingRes?.data?.title ?? "ERCMS",
        description: settingRes?.data?.description ?? "Multimedia content and blog platform"
    };

    return { contentLanguages, currentLang, metadata };
};
