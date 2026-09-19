export const calculateReadingTime = (content?: string | null): number => {
    if (!content) return 1;
    // Strip HTML tags
    const cleanText = content.replace(/<[^>]+>/g, " ").trim();
    if (!cleanText) return 1;
    const words = cleanText.split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
};
