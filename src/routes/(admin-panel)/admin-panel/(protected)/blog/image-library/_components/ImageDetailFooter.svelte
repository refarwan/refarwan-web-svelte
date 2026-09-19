<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { ResolvedPathname } from "$app/types";

    interface Props {
        currentUrl?: ResolvedPathname;
        closeLabel: string;
        deleteLabel: string;
        openLabel: string;
        onClose: () => void;
        onDelete?: () => void;
    }

    let {
        currentUrl = "" as ResolvedPathname,
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
                <Icon icon="lucide:trash-2" class="size-4" />
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
            <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-theme-600 px-5 py-2.5 text-white transition-colors hover:bg-theme-700"
            >
                <Icon icon="lucide:external-link" class="size-4" />
                <p class="text-[14px] font-medium whitespace-nowrap">
                    {openLabel}
                </p>
            </a>
        {/if}
    </div>
</div>
