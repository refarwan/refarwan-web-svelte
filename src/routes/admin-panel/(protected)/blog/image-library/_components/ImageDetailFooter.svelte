<script lang="ts">
    import { ExternalLink as ExternalLinkIcon, Trash2 as TrashIcon } from "lucide-svelte/icons";

    interface Props {
        currentUrl?: string;
        closeLabel: string;
        deleteLabel: string;
        openLabel: string;
        onClose: () => void;
        onDelete?: () => void;
    }

    let {
        currentUrl = "",
        closeLabel,
        deleteLabel,
        openLabel,
        onClose,
        onDelete
    }: Props = $props();
</script>

<div
    class="flex w-full shrink-0 items-center justify-between gap-3 rounded-b-xl border-t border-gray-200 bg-white px-6 pt-4 pb-5"
>
    <div>
        {#if onDelete}
            <button
                type="button"
                onclick={onDelete}
                class="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-red-600 transition-colors hover:bg-red-50"
            >
                <TrashIcon class="size-4" />
                <span class="text-[14px] font-medium">{deleteLabel}</span>
            </button>
        {/if}
    </div>

    <div class="flex items-center gap-2.5">
        <button
            type="button"
            onclick={onClose}
            class="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 transition-colors hover:bg-gray-50"
        >
            <p class="text-[14px] font-medium whitespace-nowrap text-gray-700">
                {closeLabel}
            </p>
        </button>
        {#if currentUrl}
            <!-- eslint-disable svelte/no-navigation-without-resolve -->
            <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-theme-600 px-5 py-2.5 text-white transition-colors hover:bg-theme-700"
            >
                <ExternalLinkIcon class="size-4" />
                <p class="text-[14px] font-medium whitespace-nowrap">
                    {openLabel}
                </p>
            </a>
            <!-- eslint-enable svelte/no-navigation-without-resolve -->
        {/if}
    </div>
</div>
