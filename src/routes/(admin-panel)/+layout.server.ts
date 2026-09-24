export const load = async ({ cookies }) => {
    const currentLang: "en-US" | "id-ID" =
        cookies.get("admin_preferred_language") === "id-ID" ? "id-ID" : "en-US";

    return { currentLang };
};
