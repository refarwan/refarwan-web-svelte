<script lang="ts">
    import { MenuIcon } from "lucide-svelte/icons";
    import { resolve } from "$app/paths";

    import { mobileMenu } from "$lib/stores/mobile-menu.svelte";
    import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";

    import type { ContentLanguage } from "$lib/types";

    interface Props {
        language: string;
        locale: string;
        contentLanguages: ContentLanguage[];
    }

    let { language, locale, contentLanguages }: Props = $props();

    const homeHref = $derived(
        resolve("/[[lang=lang]]", { lang: language === "en" ? undefined : locale })
    );

    const MENU_LABELS: Record<string, string> = {
        en: "Open navigation menu",
        id: "Buka menu navigasi",
        ja: "ナビゲーションメニューを開く"
    };

    const menuAriaLabel = $derived(MENU_LABELS[language.toLowerCase()] ?? MENU_LABELS.en);
</script>

<header
    class="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 px-5 backdrop-blur-md transition-colors md:px-10"
>
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between md:h-20">
        <a
            href={homeHref}
            class="shrink-0 text-[22px] font-extrabold tracking-tight text-theme-700 transition-colors hover:text-theme-800"
        >
            Aan Refarwan
        </a>

        <div class="flex items-center gap-2">
            <LanguageSwitcher {language} {contentLanguages} />
            <button
                type="button"
                onclick={() => (mobileMenu.open = !mobileMenu.open)}
                aria-label={menuAriaLabel}
                aria-expanded={mobileMenu.open}
                class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
            >
                <MenuIcon class="h-6 w-6" />
            </button>
        </div>
    </div>
</header>
