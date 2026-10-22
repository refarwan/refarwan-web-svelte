import { CONTENT_LANGUAGES } from "$lib/i18n/content-language";
import { getApiData } from "./api-data";

import type { DataResponse } from "$lib/types/api-response";
import type { ContentLanguage, ContentLanguageSetting } from "$lib/types/content-language";

export const getActiveContentLangs = async (
    fetchFn: typeof fetch = fetch
): Promise<ContentLanguage[]> => {
    const res = await getApiData<DataResponse<ContentLanguageSetting[]>>(
        "setting/public/content-languages",
        "settings",
        fetchFn
    );

    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const result: ContentLanguage[] = [];
        for (const item of res.data) {
            const match = CONTENT_LANGUAGES.find((lang) => lang.locale === item.code);
            if (match) {
                result.push({
                    ...match,
                    default: item.default
                });
            }
        }
        if (result.length > 0) {
            const defaultIndex = result.findIndex((l) => l.default);
            if (defaultIndex > 0) {
                const defaultItem = result[defaultIndex];
                const others = result.filter((_, idx) => idx !== defaultIndex);
                return [defaultItem, ...others];
            }
            if (defaultIndex === -1) {
                result[0].default = true;
            }
            return result;
        }
    }
    const english = CONTENT_LANGUAGES.find((lang) => lang.locale === "en-US")!;
    return [{ ...english, default: true }];
};
