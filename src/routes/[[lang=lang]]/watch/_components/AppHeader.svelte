<script lang="ts">
    import Search from "lucide-svelte/icons/search";

    import { resolve } from "$app/paths";

    import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";
    import { searchOverlay } from "$lib/stores/search-overlay.svelte";

    import AppsDropdown from "./AppsDropdown.svelte";
    import AppsIcon from "./AppsIcon.svelte";

    import type { WatchTranslation } from "$lib/i18n/watch";
    import type { ContentLanguage } from "$lib/types";

    interface Props {
        language: string;
        locale: string;
        contentLanguages: ContentLanguage[];
        basePath: string;
        t: WatchTranslation;
    }

    let { language, locale, contentLanguages, basePath, t }: Props = $props();

    let isAppsOpen = $state(false);

    const homeHref = $derived(
        resolve("/[[lang=lang]]", { lang: language === "en" ? undefined : locale })
    );
    const projectHref = $derived(`${homeHref}#projects`);
    const blogHref = $derived(homeHref);
</script>

<header
    class="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md transition-colors"
>
    <div
        class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8 lg:px-10"
    >
        <div class="flex shrink-0 items-center">
            <a
                href={basePath}
                class="text-2xl font-bold tracking-tight text-theme-700 transition-colors hover:text-theme-800 md:text-[22px]"
            >
                <span class="hidden md:inline">Aan Refarwan</span>
                <span class="md:hidden">AR</span>
                <span
                    class="ml-1.5 text-2xl font-medium tracking-tight text-theme-400 md:text-[22px]"
                >
                    Watch
                </span>
            </a>
        </div>

        <div class="flex shrink-0 items-center gap-2.5">
            <button
                type="button"
                onclick={() => (searchOverlay.open = !searchOverlay.open)}
                aria-label={t.openSearchAriaLabel}
                aria-expanded={searchOverlay.open}
                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
            >
                <Search class="h-5 w-5" />
            </button>

            <LanguageSwitcher {language} {contentLanguages} />

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
                    <AppsIcon />
                </button>

                <AppsDropdown
                    isOpen={isAppsOpen}
                    onClose={() => (isAppsOpen = false)}
                    currentApp="watch"
                    {homeHref}
                    {projectHref}
                    watchHref={basePath}
                    {blogHref}
                    homeLabel={t.appsHomeLabel}
                    projectLabel={t.appsProjectLabel}
                    watchLabel={t.appsWatchLabel}
                    blogLabel={t.appsBlogLabel}
                />
            </div>
        </div>
    </div>
</header>
