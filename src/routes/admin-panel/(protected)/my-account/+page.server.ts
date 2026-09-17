import { getAdminTranslation } from "$lib/i18n/admin";
import { getApiData } from "$lib/server/get-api-data";

import type { PageServerLoad } from "./$types";

import type { AreaItem, DataResponse } from "$lib/types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { adminLang } = await parent();

    const [provinces, allRegencies] = await Promise.all([
        getApiData<DataResponse<AreaItem[]>>("area/provinces", "area", fetch),
        getApiData<DataResponse<AreaItem[]>>("area/all-regencies", "area", fetch)
    ]);

    return {
        t: getAdminTranslation(adminLang).account,
        provinces: provinces?.data ?? [],
        allRegencies: allRegencies?.data ?? []
    };
};
