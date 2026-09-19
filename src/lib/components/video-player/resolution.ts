export interface ResolutionOption {
    quality: number;
    label: string;
    status: "ready" | "processing" | "unavailable";
    url: string | null;
}

const QUALITY_LADDER = [1080, 720, 360];

export function resolutionsFromFields(
    p360: string | null,
    p720: string | null,
    p1080: string | null
): ResolutionOption[] {
    const byQuality: Record<number, string | null> = { 1080: p1080, 720: p720, 360: p360 };

    return QUALITY_LADDER.map((quality) => {
        const value = byQuality[quality];
        if (value === "processing")
            return { quality, label: `${quality}p`, status: "processing", url: null };
        if (value) return { quality, label: `${quality}p`, status: "ready", url: value };
        return { quality, label: `${quality}p`, status: "unavailable", url: null };
    });
}

export function resolutionsFromSources(
    sources: { quality: number; label: string; url: string }[]
): ResolutionOption[] {
    return QUALITY_LADDER.map((quality) => {
        const match = sources.find((source) => source.quality === quality);
        if (match) return { quality, label: match.label, status: "ready", url: match.url };
        return { quality, label: `${quality}p`, status: "unavailable", url: null };
    });
}

export const readyResolutions = (resolutions: ResolutionOption[]): ResolutionOption[] =>
    resolutions.filter((resolution) => resolution.status === "ready" && resolution.url);

/** "Auto" always resolves to the highest ready quality. */
export const pickAutoSource = (resolutions: ResolutionOption[]): ResolutionOption | undefined =>
    readyResolutions(resolutions)[0];
