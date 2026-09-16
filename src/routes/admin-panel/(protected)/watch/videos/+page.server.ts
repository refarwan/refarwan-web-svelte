import { getAdminTranslation } from "$lib/i18n/admin";
import { getApiData } from "$lib/server/get-api-data";

import type { PageServerLoad } from "./$types";

import type { DataResponse, ImageSource } from "$lib/types";

export const load: PageServerLoad = async ({ parent }) => {
    const { adminLang } = await parent();

    const logoRes = await getApiData<DataResponse<ImageSource>>("setting/logo", "settings");

    return {
        t: getAdminTranslation(adminLang).watchVideo,
        common: getAdminTranslation(adminLang).common,
        logoUrl: logoRes?.data.small ?? ""
    };
};
