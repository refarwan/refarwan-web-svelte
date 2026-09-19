import { getActiveContentLangs } from "$lib/server/settings";

import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const contentLanguages = await getActiveContentLangs(event.fetch);
    const langParam = event.params.lang;

    let activeLang = "en-US";

    if (langParam) {
        const lang = contentLanguages.find((l) => l.locale === langParam);
        if (lang) activeLang = lang.locale;
    }

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace("%lang%", activeLang)
    });
};
