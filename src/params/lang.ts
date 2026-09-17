import { CONTENT_LANGUAGES } from "$lib/constants";

import type { ParamMatcher } from "@sveltejs/kit";

// English has no URL prefix (bare domain root), so only the other locales
// (e.g. "id-ID", "ja-JP") are valid values for the optional [[lang]] segment.
const OTHER_LOCALES = new Set(
    CONTENT_LANGUAGES.filter((lang) => lang.code !== "en").map((lang) => lang.locale)
);

export const match: ParamMatcher = (param) => OTHER_LOCALES.has(param);
