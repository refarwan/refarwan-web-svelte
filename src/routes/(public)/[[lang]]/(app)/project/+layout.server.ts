import { getApiData } from "$lib/server/api-data.js";

import type { DataResponse } from "$lib/types/api-response";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
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
