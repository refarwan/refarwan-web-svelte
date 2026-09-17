import { getApiData } from "$lib/server/get-api-data.js";
import type { DataResponse, PublicSettingsData } from "$lib/types";

export const load = async () => {
    const publicSettingRes = await getApiData<DataResponse<PublicSettingsData>>(
        "setting/public",
        "settings"
    );

    const title = publicSettingRes?.data.appMetadata.title;

    return { title };
};
