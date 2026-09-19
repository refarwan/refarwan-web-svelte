export const load = async ({ cookies }) => {
    const lang: "en-US" | "id-ID" = cookies.get("admin_lang") === "id-ID" ? "id-ID" : "en-US";

    return { currentLang: lang };
};
