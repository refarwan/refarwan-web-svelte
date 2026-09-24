import type { Actions } from "./$types";

export const actions: Actions = {
    setPreferredLanguage: async ({ request, cookies }) => {
        const formData = await request.formData();
        const lang = formData.get("admin_preferred_language");

        if (lang === "en-US" || lang === "id-ID") {
            cookies.set("admin_preferred_language", lang, {
                path: "/admin-panel",
                sameSite: "strict"
            });
        }

        return { success: true };
    }
};
