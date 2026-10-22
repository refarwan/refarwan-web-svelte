<script lang="ts">
    import { resolve } from "$app/paths";
    import { mobileMenu } from "$lib/stores/mobile-menu.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { HomeNavTranslationObjects } from "$lib/i18n/home-nav/types";
    import type { ContentLocale } from "$lib/types/content-language";

    interface Props {
        currentLang: ContentLocale;
        defaultLang?: ContentLocale;
        t: HomeNavTranslationObjects;
    }

    let { currentLang, defaultLang = "en-US", t }: Props = $props();

    const localePrefix = $derived(currentLang === defaultLang ? "" : `/${currentLang}`);

    const navItems = $derived<{ label: string; href: ResolvedPathname }[]>([
        { label: t.home, href: "#home" as ResolvedPathname },
        { label: t.about, href: "#about" as ResolvedPathname },
        { label: t.skills, href: "#skills" as ResolvedPathname },
        { label: t.projects, href: "#projects" as ResolvedPathname },
        { label: t.video, href: resolve(`${localePrefix}/watch`) }
    ]);

    $effect(() => {
        document.body.style.overflow = mobileMenu.open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    });
</script>

<div
    data-is-open={mobileMenu.open}
    class=" group invisible fixed inset-0 z-50 bg-gray-600/50 backdrop-blur-xs transition-all data-[is-open=true]:visible md:visible md:left-[50%] md:h-max md:w-max md:-translate-x-1/2 md:bg-transparent md:backdrop-blur-none"
    onclick={() => (mobileMenu.open = false)}
    aria-hidden="true"
>
    <div
        class="fixed top-0 bottom-0 left-[-100vw] z-50 flex h-full w-70 flex-col bg-white p-6 pb-10 transition-all group-data-[is-open=true]:left-0 md:relative md:left-0 md:mx-auto md:h-20 md:w-max md:flex-row md:items-center md:gap-7 md:bg-transparent md:p-0"
        role="dialog"
        aria-modal="true"
    >
        {#each navItems as item, index (item.href)}
            <a
                data-is-home={index === 0}
                href={item.href}
                onclick={() => (mobileMenu.open = false)}
                class="rounded-xl px-4 py-3.5 text-base font-medium text-gray-700 transition-colors hover:bg-theme-50 hover:text-theme-600 data-[is-home=true]:bg-theme-100 data-[is-home=true]:text-theme-600 md:h-max md:p-0 md:hover:bg-transparent md:data-[is-home=true]:bg-transparent"
            >
                {item.label}
            </a>
        {/each}
    </div>
</div>
