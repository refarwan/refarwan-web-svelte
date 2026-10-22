<script lang="ts">
    import type { ContentLanguage, ContentLocale } from "$lib/types/content-language";

    interface Props {
        languages: ContentLanguage[];
        activeCode: ContentLocale;
        onSelect: (code: ContentLocale) => void;
    }

    let { languages, activeCode, onSelect }: Props = $props();
</script>

{#if languages.length > 1}
    <div class="flex flex-wrap items-center gap-1.5">
        {#each languages as lang (lang.locale)}
            <button
                type="button"
                onclick={() => onSelect(lang.locale)}
                class={`inline-flex h-6.5 cursor-pointer items-center gap-1 rounded-full pr-2.5 pl-2 text-xs transition-colors ${activeCode === lang.locale ? "bg-theme-600 font-semibold text-white " : "font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
            >
                <span class="text-[11px] leading-none select-none">{lang.flag}</span>
                <span class="text-xs leading-none uppercase">{lang.locale}</span>
            </button>
        {/each}
    </div>
{/if}
