import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        lang: locals.lang,
        locale: locals.locale,
        contentLanguages: locals.contentLanguages
    };
};
