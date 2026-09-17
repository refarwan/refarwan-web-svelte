<script lang="ts">
    import { FilmIcon } from "lucide-svelte/icons";
    interface Props {
        t: Record<string, string>;
        videoPreviewUrl: string;
        videoDuration: number;
        videoCurrentTime: number;
        onVideoTimeChange: (time: number) => void;
        onLoadedMetadata: (duration: number) => void;
    }

    let {
        t,
        videoPreviewUrl,
        videoDuration,
        videoCurrentTime,
        onVideoTimeChange,
        onLoadedMetadata
    }: Props = $props();

    let videoEl: HTMLVideoElement | undefined = $state();

    const formatTime = (sec: number): string => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const onScrub = (event: Event) => {
        const time = Number((event.target as HTMLInputElement).value);
        onVideoTimeChange(time);
        if (videoEl) videoEl.currentTime = time;
    };
</script>

{#if !videoPreviewUrl}
    <div
        class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-6 text-center"
    >
        <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500"
        >
            <FilmIcon class="h-4 w-4" />
        </div>
        <p class="text-xs font-medium text-gray-700">{t.thumbnailNoVideoTitle}</p>
        <p class="text-[11px] text-gray-400">{t.thumbnailNoVideoHint}</p>
    </div>
{:else}
    <div class="space-y-3 rounded-lg border border-gray-200 bg-gray-50/80 p-3">
        <div class="relative aspect-video overflow-hidden rounded-md bg-black">
            <video
                bind:this={videoEl}
                src={videoPreviewUrl}
                playsinline
                muted
                preload="auto"
                onloadedmetadata={() => onLoadedMetadata(videoEl?.duration ?? 0)}
                class="h-full w-full object-contain"
            ></video>
        </div>

        <div class="space-y-1">
            <div class="flex items-center justify-between text-[11px] text-gray-500">
                <span>{t.thumbnailSelectFrameLabel}</span>
                <span>{formatTime(videoCurrentTime)} / {formatTime(videoDuration)}</span>
            </div>
            <input
                type="range"
                min="0"
                max={videoDuration || 100}
                step="0.1"
                value={videoCurrentTime}
                oninput={onScrub}
                class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-theme-600"
            />
        </div>
    </div>
{/if}
