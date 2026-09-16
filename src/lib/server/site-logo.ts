import { getApiData } from "./get-api-data";

import type { DataResponse, ImageSource } from "$lib/types";

export const getSiteLogoUrl = async (fetchFn: typeof fetch = fetch): Promise<string> => {
    const res = await getApiData<DataResponse<ImageSource>>("setting/logo", "settings", fetchFn);
    return res?.data.small ?? "";
};
