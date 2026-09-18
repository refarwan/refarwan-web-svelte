<script lang="ts">
    import { LoaderCircle } from "lucide-svelte/icons";

    interface Props {
        t: Record<string, string>;
        cancelLabel: string;
        cancelHref: string;
        status: string;
        submitting?: boolean;
        loadingLabel?: string;
        onSubmit: () => void;
    }

    let {
        t,
        cancelLabel,
        cancelHref,
        status,
        submitting = false,
        loadingLabel,
        onSubmit
    }: Props = $props();

    const submitLabel = $derived(
        status === "draft"
            ? t.submitDraft
            : status === "archived"
              ? t.submitArchived
              : t.submitPublish
    );
</script>

<div class="flex items-center justify-end gap-3 pt-2">
    <a
        href={cancelHref}
        class={`rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 ${
            submitting ? "pointer-events-none opacity-50" : ""
        }`}
    >
        {cancelLabel}
    </a>

    <button
        type="button"
        disabled={submitting}
        onclick={onSubmit}
        class="cursor-pointer rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-theme-700 disabled:opacity-50"
    >
        {#if submitting}
            <span class="flex items-center gap-2">
                <LoaderCircle class="size-4 animate-spin text-white" />
                <span>{loadingLabel}</span>
            </span>
        {:else}
            {submitLabel}
        {/if}
    </button>
</div>
