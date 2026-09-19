import { getApiData } from "$lib/server/api-data";
import { ACCOUNT_TRANSLATIONS } from "../../../i18n/account";

import type { DataResponse } from "$lib/types/api-response";
import type { AreaItem } from "$lib/types/area";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { currentLang } = await parent();

    const [provinces, allRegencies] = await Promise.all([
        getApiData<DataResponse<AreaItem[]>>("area/provinces", "area", fetch),
        getApiData<DataResponse<AreaItem[]>>("area/all-regencies", "area", fetch)
    ]);

    return {
        t: ACCOUNT_TRANSLATIONS[currentLang],
        provinces: provinces?.data ?? [],
        allRegencies: allRegencies?.data ?? []
    };
};
