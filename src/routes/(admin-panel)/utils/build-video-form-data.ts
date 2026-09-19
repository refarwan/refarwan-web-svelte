import type { ContentLanguage } from "$lib/types/content-language";

interface BuildVideoFormDataInput {
    videoFile: File;
    primaryTitle: string;
    primaryDescription: string;
    categoryId: string;
    status: string;
    contentLanguages: ContentLanguage[];
    titles: Record<string, string>;
    descriptions: Record<string, string>;
    thumbnailMode: "video" | "upload";
    thumbnailFile: File | null;
    thumbnailPosition: number;
}

export const buildVideoFormData = (input: BuildVideoFormDataInput): FormData => {
    const translations = input.contentLanguages
        .filter((lang) => lang.code !== "en" && input.titles[lang.code]?.trim())
        .map((lang) => ({
            languageCode: lang.locale,
            title: input.titles[lang.code].trim(),
            description: input.descriptions[lang.code]?.trim() || input.titles[lang.code].trim()
        }));

    const formData = new FormData();
    formData.set("video", input.videoFile);
    formData.set("title", input.primaryTitle);
    if (input.primaryDescription) formData.set("description", input.primaryDescription);
    if (input.categoryId) formData.set("categoryId", input.categoryId);
    formData.set("status", input.status);
    if (translations.length > 0) formData.set("translations", JSON.stringify(translations));
    if (input.thumbnailMode === "upload" && input.thumbnailFile) {
        formData.set("thumbnail", input.thumbnailFile);
    } else if (input.thumbnailMode === "video") {
        formData.set("thumbnailPosition", String(Math.round(input.thumbnailPosition)));
    }
    return formData;
};
