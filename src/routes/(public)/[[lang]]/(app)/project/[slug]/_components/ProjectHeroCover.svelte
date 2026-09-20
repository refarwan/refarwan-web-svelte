<script lang="ts">
    import type { ImageVariant } from "$lib/types/image";

    interface Props {
        thumbnail: ImageVariant;
        title: string;
    }

    let { thumbnail, title }: Props = $props();

    const imageUrl = $derived(thumbnail?.large || thumbnail?.medium || thumbnail?.small || "");
</script>

{#if imageUrl}
    <div
        class="mt-6 w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:mt-8 sm:rounded-2xl"
    >
        <img
            src={imageUrl}
            alt={title}
            class="h-56 w-full object-cover sm:h-80 md:h-105 lg:h-120"
        />
    </div>
{/if}
