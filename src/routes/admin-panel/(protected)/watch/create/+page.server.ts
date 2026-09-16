import { getAdminTranslation } from "$lib/i18n/admin";
import { authFetch } from "$lib/server/api-auth";
import { getActiveContentLangs } from "$lib/server/settings";

import type { PageServerLoad } from "./$types";

import type { AdminOptionItem, DataResponse } from "$lib/types";

export const load: PageServerLoad = async ({ parent, cookies, fetch }) => {
    const { adminLang } = await parent();

    const [categoriesRes, contentLanguages] = await Promise.all([
        authFetch(cookies, fetch, "/video-category/admin-options"),
        getActiveContentLangs(fetch)
    ]);

    const categories = categoriesRes.ok
        ? ((await categoriesRes.json()) as DataResponse<AdminOptionItem[]>).data
        : [];

    return {
        t: getAdminTranslation(adminLang).watchVideo,
        common: getAdminTranslation(adminLang).common,
        categories,
        contentLanguages
    };
};
