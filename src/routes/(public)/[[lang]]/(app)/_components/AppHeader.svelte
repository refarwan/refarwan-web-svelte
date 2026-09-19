<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { APPS_DROPDOWN_TRANSLATIONS } from "$lib/i18n/apps-dropdown";
    import { searchOverlay } from "$lib/stores/search-overlay.svelte";
    import LanguageSwitcher from "../../../_components/LanguageSwitcher.svelte";
    import AppsDropdown from "./AppsDropdown.svelte";

    import type { ContentLocale } from "$lib/i18n/types";
    import type { ContentLanguage } from "$lib/types/content-language";

    interface Props {
        appName: string;
        currentApp: string;
        currentLang: ContentLocale;
        contentLanguages: ContentLanguage[];
    }

    let { appName, currentApp, currentLang, contentLanguages }: Props = $props();

    let isAppsOpen = $state(false);

    const t = $derived(
        APPS_DROPDOWN_TRANSLATIONS[currentLang] ?? APPS_DROPDOWN_TRANSLATIONS["en-US"]
    );
    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const appHref = $derived(
        resolve(
            (currentApp === "home"
                ? localePrefix || "/"
                : `${localePrefix}/${currentApp}`) as `/${string}`
        )
    );
</script>

<header
    class="fixed top-0 z-40 w-full border-b border-gray-200 bg-white backdrop-blur-md transition-colors"
>
    <div
        class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8 lg:px-10"
    >
        <div class="flex shrink-0 items-center">
            <a
                href={appHref}
                class="text-2xl font-bold tracking-tight text-theme-700 transition-colors hover:text-theme-800 md:text-[22px]"
            >
                <span class="hidden lg:inline">Aan Refarwan</span>
                <span class="lg:hidden">AR</span>
                <span
                    class="ml-1.5 text-2xl font-medium tracking-tight text-theme-400 md:text-[22px]"
                >
                    {appName}
                </span>
            </a>
        </div>

        <div class="flex shrink-0 items-center gap-2.5">
            {#if currentApp === "watch" || currentApp === "blog"}
                <button
                    type="button"
                    onclick={() => (searchOverlay.open = !searchOverlay.open)}
                    aria-label={t.openSearchAriaLabel}
                    aria-expanded={searchOverlay.open}
                    class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
                >
                    <Icon icon="lucide:search" class="h-5 w-5" />
                </button>
            {/if}

            <LanguageSwitcher {currentLang} {contentLanguages} />

            <div class="relative">
                <button
                    type="button"
                    onclick={() => (isAppsOpen = !isAppsOpen)}
                    aria-label={t.appsMenuAriaLabel}
                    aria-expanded={isAppsOpen}
                    class={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 ${
                        isAppsOpen ? "bg-gray-100 text-gray-800" : ""
                    }`}
                >
                    <Icon class="h-6 w-6" icon="material-symbols:apps" />
                </button>

                <AppsDropdown
                    isOpen={isAppsOpen}
                    onClose={() => (isAppsOpen = false)}
                    {currentApp}
                    {currentLang}
                />
            </div>
        </div>
    </div>
</header>
