import { getApiData } from "$lib/server/api-data.js";

import type { DataResponse } from "$lib/types/api-response";

export const load = async ({ fetch }) => {
    interface Metadata {
        title: string;
        description: string;
    }

    const settingRes = await getApiData<DataResponse<Metadata>>(
        "setting/public/metadata",
        "settings",
        fetch
    );

    const metadata: Metadata = {
        title: settingRes?.data?.title ?? "ERCMS",
        description: settingRes?.data?.description ?? "Multimedia content and blog platform"
    };

    return { metadata };
};
