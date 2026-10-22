import type { LayoutServerLoad } from "./$types";
import type { AdminLocale } from "./i18n/types";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const currentLang: AdminLocale =
        cookies.get("admin_preferred_language") === "id-ID" ? "id-ID" : "en-US";

    return { currentLang };
};
