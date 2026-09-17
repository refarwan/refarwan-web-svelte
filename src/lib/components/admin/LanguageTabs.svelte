<script lang="ts">
    import type { ContentLanguage } from "$lib/types";

    interface Props {
        languages: ContentLanguage[];
        activeCode: string;
        onSelect: (code: string) => void;
    }

    let { languages, activeCode, onSelect }: Props = $props();
</script>

{#if languages.length > 1}
    <div class="flex flex-wrap items-center gap-1.5">
        {#each languages as lang (lang.code)}
            <button
                type="button"
                onclick={() => onSelect(lang.code)}
                class={`inline-flex h-6.5 cursor-pointer items-center gap-1 rounded-full pr-2.5 pl-2 text-xs transition-colors ${
                    activeCode === lang.code
                        ? "bg-theme-600 font-semibold text-white shadow-2xs"
                        : "font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
                <span class="text-[11px] leading-none select-none">{lang.flag}</span>
                <span class="text-xs leading-none uppercase">{lang.code}</span>
            </button>
        {/each}
    </div>
{/if}
