<script lang="ts">
    import {
        MaximizeIcon,
        MinimizeIcon,
        PauseIcon,
        PlayIcon,
        Volume1Icon,
        Volume2Icon,
        VolumeXIcon
    } from "lucide-svelte/icons";

    import PlayerSettingsMenu from "./PlayerSettingsMenu.svelte";
    import { formatTime } from "./format-time";

    import type { ResolutionOption } from "./resolution";

    interface Props {
        isPlaying: boolean;
        currentTime: number;
        duration: number;
        volume: number;
        isMuted: boolean;
        playbackRate: number;
        isFullscreen: boolean;
        resolutions: ResolutionOption[];
        selectedQuality: number | "auto";
        onTogglePlay: () => void;
        onToggleMute: () => void;
        onVolumeChange: (value: number) => void;
        onSelectRate: (rate: number) => void;
        onSelectQuality: (quality: number | "auto") => void;
        onToggleFullscreen: () => void;
        onSeek: (time: number) => void;
    }

    let {
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        isFullscreen,
        resolutions,
        selectedQuality,
        onTogglePlay,
        onToggleMute,
        onVolumeChange,
        onSelectRate,
        onSelectQuality,
        onToggleFullscreen,
        onSeek
    }: Props = $props();

    const progressPercent = $derived(
        duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0
    );
    const VolumeIcon = $derived(
        isMuted || volume === 0 ? VolumeXIcon : volume < 0.5 ? Volume1Icon : Volume2Icon
    );

    let trackEl: HTMLDivElement | undefined = $state();
    let isDragging = $state(false);

    const seekFromEvent = (event: PointerEvent) => {
        if (!trackEl) return;
        const rect = trackEl.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        onSeek(ratio * duration);
    };

    const onPointerDown = (event: PointerEvent) => {
        isDragging = true;
        seekFromEvent(event);
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (!isDragging) return;
        seekFromEvent(event);
    };
</script>

<div
    class="absolute right-0 bottom-0 left-0 z-10 flex flex-col gap-1.5 bg-linear-to-t from-black/80 to-transparent px-3 pt-8 pb-2.5 sm:px-4"
>
    <div
        bind:this={trackEl}
        onpointerdown={onPointerDown}
        onpointermove={onPointerMove}
        onpointerup={() => (isDragging = false)}
        role="slider"
        aria-label="Seek"
        aria-valuemin="0"
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabindex="0"
        class="group/seek relative h-3 w-full cursor-pointer touch-none"
    >
        <div class="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/25"></div>
        <div
            class="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-theme-500"
            style={`width: ${progressPercent}%`}
        ></div>
        <div
            class="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-theme-500 opacity-0 transition-opacity group-hover/seek:opacity-100"
            style={`left: ${progressPercent}%`}
        ></div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
        <button
            type="button"
            onclick={onTogglePlay}
            class="grid h-8 w-8 place-content-center rounded-full text-white transition-colors hover:bg-white/15"
            aria-label={isPlaying ? "Pause" : "Play"}
        >
            {#if isPlaying}
                <PauseIcon class="h-4.5 w-4.5" fill="currentColor" />
            {:else}
                <PlayIcon class="h-4.5 w-4.5" fill="currentColor" />
            {/if}
        </button>

        <div class="group/volume flex items-center gap-1.5">
            <button
                type="button"
                onclick={onToggleMute}
                class="grid h-8 w-8 place-content-center rounded-full text-white transition-colors hover:bg-white/15"
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                <VolumeIcon class="h-4.5 w-4.5" />
            </button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                oninput={(event) =>
                    onVolumeChange(Number((event.target as HTMLInputElement).value))}
                class="hidden h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/25 accent-white sm:block"
            />
        </div>

        <span class="text-xs text-white/90 tabular-nums select-none">
            {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div class="flex-1"></div>

        <PlayerSettingsMenu
            {playbackRate}
            {onSelectRate}
            {resolutions}
            {selectedQuality}
            {onSelectQuality}
        />

        <button
            type="button"
            onclick={onToggleFullscreen}
            class="grid h-8 w-8 place-content-center rounded-full text-white transition-colors hover:bg-white/15"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
            {#if isFullscreen}
                <MinimizeIcon class="h-4.5 w-4.5" />
            {:else}
                <MaximizeIcon class="h-4.5 w-4.5" />
            {/if}
        </button>
    </div>
</div>
