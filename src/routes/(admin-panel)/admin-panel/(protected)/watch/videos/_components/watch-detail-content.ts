import type { ContentLanguage } from "$lib/types/content-language";
import type { VideoDetail } from "$lib/types/video";
import type { TabLang } from "./WatchDetailLangTabs.svelte";

const defaultFlags: Record<string, string> = {
    en: "🇬🇧",
    id: "🇮🇩",
    ja: "🇯🇵",
    ko: "🇰🇷",
    zh: "🇨🇳",
    es: "🇪🇸",
    fr: "🇫🇷",
    de: "🇩🇪",
    ar: "🇸🇦"
};

export function buildTabLanguages(
    contentLanguages: ContentLanguage[] = [],
    video: VideoDetail
): TabLang[] {
    const list: TabLang[] = [];
    if (contentLanguages.length > 0) {
        for (const cl of contentLanguages) {
            const code = cl.code.toLowerCase();
            list.push({
                code,
                name: cl.name || code.toUpperCase(),
                flag: cl.flag || defaultFlags[code] || "🌐"
            });
        }
    } else {
        list.push({ code: "en", name: "EN", flag: "🇬🇧" });
        list.push({ code: "id", name: "ID", flag: "🇮🇩" });
    }

    if (video.translations) {
        for (const tr of video.translations) {
            const code = tr.languageCode.toLowerCase();
            if (!list.some((l) => l.code === code)) {
                list.push({
                    code,
                    name: code.toUpperCase(),
                    flag: defaultFlags[code] || "🌐"
                });
            }
        }
    }
    return list;
}

export function resolveActiveContent(
    video: VideoDetail,
    activeLangCode: string
): { title: string; description: string; isFallback: boolean } {
    if (activeLangCode === "en") {
        return {
            title: video.title || "",
            description: video.description || "",
            isFallback: false
        };
    }

    const translation = video.translations?.find(
        (tr) => tr.languageCode.toLowerCase() === activeLangCode
    );

    if (translation) {
        return {
            title: translation.title || "",
            description: translation.description || "",
            isFallback: false
        };
    }

    return {
        title: video.title || "",
        description: video.description || "",
        isFallback: true
    };
}
