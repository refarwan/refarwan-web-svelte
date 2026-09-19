import { error } from "@sveltejs/kit";
import { CONTENT_LANGUAGES } from "$lib/constants/content-language";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    if (params.lang && !CONTENT_LANGUAGES.some((l) => l.locale === params.lang)) {
        error(404, "Page not found");
    }
};
