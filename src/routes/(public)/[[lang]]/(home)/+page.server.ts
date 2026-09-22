import { error } from "@sveltejs/kit";
import { CONTENT_LANGUAGES } from "$lib/constants/content-language";
import { getApiData } from "$lib/server/api-data";

import type { HomeTranslation } from "$lib/i18n/home";
import type { DataResponse } from "$lib/types/api-response";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent, fetch }) => {
    if (params.lang && !CONTENT_LANGUAGES.some((l) => l.locale === params.lang)) {
        error(404, "Page not found");
    }

    const { currentLang } = await parent();

    const landingData = await getApiData<DataResponse<HomeTranslation>>(
        `landing-page/public?locale=${currentLang}`,
        "landing-page",
        fetch,
        { "Accept-Language": currentLang }
    );

    return {
        homeData: landingData?.data ?? null
    };
};
