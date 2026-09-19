<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { ResolvedPathname } from "$app/types";

    interface Props {
        logoUrl?: string;
        title?: string;
        watchUrl?: ResolvedPathname;
        playOnWatchLabel?: string;
    }

    let { logoUrl, title, watchUrl, playOnWatchLabel = "Play on Watch" }: Props = $props();
</script>

<div
    class="absolute top-0 right-0 left-0 z-10 flex items-center justify-between gap-3 bg-linear-to-b from-black/70 to-transparent p-3 sm:p-4"
>
    <div class="flex min-w-0 items-center gap-2.5">
        {#if logoUrl}
            <img src={logoUrl} alt="" class="h-6 w-auto shrink-0 object-contain sm:h-7" />
        {/if}
        {#if title}
            <span class="truncate text-sm font-medium text-white sm:text-base">{title}</span>
        {/if}
    </div>
    {#if watchUrl}
        <a
            href={watchUrl}
            target="_blank"
            rel="external noopener noreferrer"
            class="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
            <span>{playOnWatchLabel}</span>
            <Icon icon="lucide:external-link" class="h-4 w-4" />
        </a>
    {/if}
</div>
