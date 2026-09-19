import { CONTENT_LANGUAGES } from "$lib/constants/content-language";
import { getApiData } from "./api-data";

import type { DataResponse } from "$lib/types/api-response";
import type { ContentLanguage } from "$lib/types/content-language";

export const getActiveContentLangs = async (
    fetchFn: typeof fetch = fetch
): Promise<ContentLanguage[]> => {
    const res = await getApiData<DataResponse<string[]>>(
        "setting/public/other-content-languages",
        "settings",
        fetchFn
    );

    const otherLocales = new Set(res?.data ?? []);
    const english = CONTENT_LANGUAGES.find((lang) => lang.locale === "en-US")!;
    const others = CONTENT_LANGUAGES.filter(
        (lang) => lang.locale !== "en-US" && otherLocales.has(lang.locale)
    );

    return [english, ...others];
};
