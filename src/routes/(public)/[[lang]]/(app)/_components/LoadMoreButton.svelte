<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        hasMore: boolean;
        loading?: boolean;
        label?: string;
        loadingLabel?: string;
        onloadmore: () => void | Promise<void>;
    }

    let {
        hasMore,
        loading = false,
        label = "Load more",
        loadingLabel = "Loading...",
        onloadmore
    }: Props = $props();
</script>

{#if hasMore}
    <div class="flex w-full justify-center pt-6 pb-2">
        <button
            type="button"
            onclick={onloadmore}
            disabled={loading}
            class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {#if loading}
                <Icon icon="lucide:loader-circle" class="h-4 w-4 animate-spin text-theme-600" />
                <span>{loadingLabel}</span>
            {:else}
                <span>{label}</span>
                <Icon icon="lucide:chevron-down" class="h-4 w-4 text-gray-500" />
            {/if}
        </button>
    </div>
{/if}
