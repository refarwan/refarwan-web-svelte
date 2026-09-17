import { CONTENT_LANGUAGES } from "$lib/constants";

import { getApiData } from "./get-api-data";

import type { ContentLanguage, DataResponse } from "$lib/types";

export const getActiveContentLangs = async (
    fetchFn: typeof fetch = fetch
): Promise<ContentLanguage[]> => {
    const res = await getApiData<DataResponse<string[]>>(
        "setting/other-content-languages",
        "settings",
        fetchFn
    );

    const otherLocales = new Set(res?.data ?? []);
    const english = CONTENT_LANGUAGES.find((lang) => lang.code === "en")!;
    const others = CONTENT_LANGUAGES.filter(
        (lang) => lang.code !== "en" && otherLocales.has(lang.locale)
    );

    return [english, ...others];
};
