export const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;

    if (hours > 0) {
        const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        return `${hours}:${paddedMinutes}:${paddedSecs}`;
    }

    return `${minutes}:${paddedSecs}`;
};
