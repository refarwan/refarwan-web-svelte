import { getApiData } from "./api-data";

import type { DataResponse } from "$lib/types/api-response";
import type { ImageSource } from "$lib/types/setting";

export const getSiteLogoUrl = async (fetchFn: typeof fetch = fetch): Promise<string> => {
    const res = await getApiData<DataResponse<ImageSource>>("setting/logo", "settings", fetchFn);
    return res?.data.small ?? "";
};
