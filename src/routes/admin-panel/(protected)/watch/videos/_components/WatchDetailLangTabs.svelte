<script lang="ts">
    export interface TabLang {
        code: string;
        name: string;
        flag: string;
    }

    interface Props {
        tabLanguages: TabLang[];
        activeLangCode: string;
        onSelect: (code: string) => void;
    }

    let { tabLanguages, activeLangCode, onSelect }: Props = $props();
</script>

{#if tabLanguages.length > 1}
    <div
        class="flex w-full shrink-0 items-center gap-1.5 overflow-x-auto rounded-full whitespace-nowrap"
    >
        {#each tabLanguages as tab (tab.code)}
            {@const isActive = activeLangCode === tab.code}
            <button
                type="button"
                onclick={() => onSelect(tab.code)}
                class={`flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full py-1 pr-2.5 pl-2 text-[12px] transition-colors ${
                    isActive
                        ? "bg-theme-600 font-medium text-white"
                        : "font-semibold text-gray-500 hover:bg-gray-100"
                }`}
            >
                <span class="text-[11px] leading-none">{tab.flag}</span>
                <span>{tab.name}</span>
            </button>
        {/each}
    </div>
{/if}
