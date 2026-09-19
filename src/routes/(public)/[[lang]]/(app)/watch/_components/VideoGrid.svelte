<script lang="ts">
    import VideoCard from "./VideoCard.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { PublicVideoItem } from "$lib/types/video";

    interface Props {
        videos: PublicVideoItem[];
        lang: string;
        viewsLabel: string;
        noVideosLabel: string;
        buildPlayHref: (id: string) => ResolvedPathname;
    }

    let { videos, lang, viewsLabel, noVideosLabel, buildPlayHref }: Props = $props();
</script>

{#if videos.length === 0}
    <div class="py-16 text-center text-sm text-gray-500">{noVideosLabel}</div>
{:else}
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each videos as video, index (video.id)}
            <VideoCard
                {video}
                {lang}
                {viewsLabel}
                href={buildPlayHref(video.id)}
                priority={index < 3}
            />
        {/each}
    </div>
{/if}
