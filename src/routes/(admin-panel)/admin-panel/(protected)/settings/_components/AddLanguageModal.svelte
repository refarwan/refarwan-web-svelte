<script lang="ts">
    import Icon from "@iconify/svelte";
    import { CONTENT_LANGUAGES } from "$lib/i18n/content-language";

    interface Props {
        activeCodes: string[];
        defaultCode?: string;
        onClose: () => void;
        onAddLanguage: (locale: string) => void;
        onRemoveLanguage?: (locale: string) => void;
        title: string;
        searchPlaceholder: string;
        defaultLabel: string;
        activeLabel: string;
        addLabel: string;
        removeLabel?: string;
        doneLabel: string;
        closeLabel: string;
    }

    let {
        activeCodes,
        defaultCode = "en-US",
        onClose,
        onAddLanguage,
        onRemoveLanguage,
        title,
        searchPlaceholder,
        defaultLabel,
        activeLabel,
        addLabel,
        removeLabel = "Remove",
        doneLabel,
        closeLabel
    }: Props = $props();

    let searchQuery = $state("");

    const filteredLanguages = $derived(
        CONTENT_LANGUAGES.filter(
            (lang) =>
                lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lang.locale.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleAdd = (locale: string): void => {
        onAddLanguage(locale);
    };

    const handleRemove = (locale: string): void => {
        onRemoveLanguage?.(locale);
    };
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === "Escape") onClose();
    }}
/>

<div
    class="animate-popup-card relative w-full max-w-105 rounded-2xl border border-gray-200 bg-white shadow-2xl"
>
    <div class="flex items-center justify-between px-5 py-4">
        <h3 class="text-base font-semibold text-gray-900">{title}</h3>
        <button
            type="button"
            onclick={onClose}
            aria-label={closeLabel}
            class="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
            <Icon icon="lucide:x" class="h-4 w-4" />
        </button>
    </div>

    <hr class="border-gray-100" />

    <div class="p-4 pb-2">
        <div class="relative flex items-center">
            <Icon
                icon="lucide:search"
                class="pointer-events-none absolute left-3 h-4 w-4 text-gray-400"
            />
            <input
                type="text"
                bind:value={searchQuery}
                placeholder={searchPlaceholder}
                class="w-full rounded-md border border-gray-200 py-2 pr-9 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
            {#if searchQuery}
                <button
                    type="button"
                    onclick={() => (searchQuery = "")}
                    class="absolute right-2.5 cursor-pointer p-0.5 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                >
                    <Icon icon="lucide:x" class="h-3.5 w-3.5" />
                </button>
            {/if}
        </div>
    </div>

    <div class="max-h-72 space-y-1 overflow-y-auto px-4 py-2">
        {#each filteredLanguages as item (item.locale)}
            {@const isDefault = item.locale === defaultCode}
            {@const isActive = activeCodes.includes(item.locale)}
            <div
                class="flex items-center justify-between rounded-lg p-2.5 transition-colors hover:bg-gray-50"
            >
                <div class="flex items-center gap-3">
                    <span class="text-lg select-none">{item.flag}</span>
                    <div>
                        <p class="text-sm font-medium text-gray-800">{item.name}</p>
                        <p class="text-[11px] text-gray-400">{item.locale}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    {#if isDefault}
                        <span
                            class="rounded-full bg-theme-50 px-2.5 py-0.5 text-xs font-medium text-theme-700"
                        >
                            {defaultLabel}
                        </span>
                    {:else if isActive}
                        <span
                            class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                        >
                            {activeLabel}
                        </span>
                        {#if onRemoveLanguage}
                            <button
                                type="button"
                                onclick={() => handleRemove(item.locale)}
                                class="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                title={removeLabel}
                            >
                                <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                            </button>
                        {/if}
                    {:else}
                        <button
                            type="button"
                            onclick={() => handleAdd(item.locale)}
                            class="cursor-pointer rounded-md border border-theme-600 px-3 py-1 text-xs font-medium text-theme-600 transition-colors hover:bg-theme-50"
                        >
                            {addLabel}
                        </button>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="py-8 text-center text-xs text-gray-400">
                {searchPlaceholder}
            </div>
        {/each}
    </div>

    <hr class="border-gray-100" />

    <div class="p-4">
        <button
            type="button"
            onclick={onClose}
            class="w-full cursor-pointer rounded-lg bg-theme-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-theme-700"
        >
            {doneLabel}
        </button>
    </div>
</div>
