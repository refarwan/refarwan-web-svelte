<script lang="ts">
    import SearchResultRow from "./SearchResultRow.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { PublicVideoItem } from "$lib/types/video";

    interface Props {
        videos: PublicVideoItem[];
        search: string;
        lang: string;
        viewsLabel: string;
        noVideosLabel: string;
        buildPlayHref: (id: string) => ResolvedPathname;
    }

    let { videos, search, lang, viewsLabel, noVideosLabel, buildPlayHref }: Props = $props();
</script>

{#if videos.length === 0}
    <div class="py-16 text-center">
        <p class="text-base font-medium text-gray-700">
            {search ? `${noVideosLabel} ("${search}")` : noVideosLabel}
        </p>
    </div>
{:else}
    <div class="divide-y divide-gray-200">
        {#each videos as video, idx (video.id)}
            <SearchResultRow
                {video}
                href={buildPlayHref(video.id)}
                {lang}
                {viewsLabel}
                priority={idx < 2}
            />
        {/each}
    </div>
{/if}
