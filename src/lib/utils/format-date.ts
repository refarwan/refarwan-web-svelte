export const formatArticleDate = (date: string | Date, lang: string = "en-US"): string => {
    try {
        const d = typeof date === "string" ? new Date(date) : date;
        const locale =
            lang === "id-ID" || lang === "id"
                ? "id-ID"
                : lang === "ja-JP" || lang === "ja"
                  ? "ja-JP"
                  : "en-US";
        return d.toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    } catch {
        return "";
    }
};
