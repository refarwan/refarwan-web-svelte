/** Toggles the browser Fullscreen API on the given container and tracks its state. */
export function useFullscreen(getContainerEl: () => HTMLElement | undefined) {
    let isFullscreen = $state(false);

    const toggleFullscreen = () => {
        const el = getContainerEl();
        if (!el) return;

        if (!document.fullscreenElement) {
            el.requestFullscreen?.().catch(() => {});
        } else {
            document.exitFullscreen?.().catch(() => {});
        }
    };

    $effect(() => {
        const onChange = () => {
            isFullscreen = document.fullscreenElement != null;
        };
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    });

    return {
        get isFullscreen() {
            return isFullscreen;
        },
        toggleFullscreen
    };
}
