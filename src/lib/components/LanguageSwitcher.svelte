<script lang="ts">
    import { page } from "$app/state";

    import type { ContentLanguage } from "$lib/types";

    interface Props {
        language: string;
        contentLanguages: ContentLanguage[];
    }

    let { language, contentLanguages }: Props = $props();

    let isOpen = $state(false);
    let containerRef: HTMLDivElement | undefined = $state();

    const activeLanguage = $derived(language.toLowerCase());
    const currentOption = $derived(
        contentLanguages.find((opt) => opt.code === activeLanguage) ??
            contentLanguages[0] ?? { code: "en", locale: "en-US", name: "English", flag: "🇺🇸" }
    );

    // The current locale prefix (if any) is exposed as the [[lang]] route param, so
    // stripping it off the pathname gives the path relative to the language segment.
    const pathWithoutLang = $derived.by(() => {
        const currentLang = page.params.lang;
        const pathname = page.url.pathname;
        if (!currentLang) return pathname;
        return pathname.slice(`/${currentLang}`.length) || "/";
    });

    const hrefFor = (option: ContentLanguage): string => {
        const rest = pathWithoutLang === "/" ? "" : pathWithoutLang;
        const base = option.code === "en" ? rest || "/" : `/${option.locale}${rest}`;
        return `${base}${page.url.search}`;
    };

    $effect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef && !containerRef.contains(event.target as Node)) {
                isOpen = false;
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") isOpen = false;
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    });
</script>

{#if contentLanguages.length > 1}
    <div bind:this={containerRef} class="relative inline-block select-none">
        <button
            type="button"
            onclick={() => (isOpen = !isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={`Select language. Current language: ${currentOption.name}`}
            class={`flex h-7.5 w-13.75 cursor-pointer items-center justify-center gap-1 rounded-full text-xs transition-all ${
                isOpen
                    ? "bg-theme-600 font-semibold text-white shadow-xs"
                    : "border-[1.5px] border-gray-200 bg-white font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
        >
            <span class="text-[11px] leading-none">{currentOption.flag}</span>
            <span class="leading-none">{currentOption.code.toUpperCase()}</span>
        </button>

        {#if isOpen}
            <div
                role="listbox"
                aria-label="Language options"
                class="absolute top-full right-0 z-50 mt-1 flex w-max min-w-full flex-col rounded-lg border border-gray-100 bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
                {#each contentLanguages as option (option.code)}
                    {@const isSelected = option.code === currentOption.code}
                    <!-- hrefFor swaps the locale segment of the *current* URL, whatever route
                        it is, so the target can't be a compile-time resolve() call. -->
                    <!-- eslint-disable svelte/no-navigation-without-resolve -->
                    <a
                        href={hrefFor(option)}
                        role="option"
                        aria-selected={isSelected}
                        onclick={() => (isOpen = false)}
                        class={`flex h-6.75 w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs whitespace-nowrap transition-colors ${
                            isSelected
                                ? "bg-theme-50 font-medium text-gray-900"
                                : "font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                    >
                        <span class="text-[12px] leading-none">{option.flag}</span>
                        <span class="leading-none whitespace-nowrap">{option.name}</span>
                    </a>
                    <!-- eslint-enable svelte/no-navigation-without-resolve -->
                {/each}
            </div>
        {/if}
    </div>
{/if}
