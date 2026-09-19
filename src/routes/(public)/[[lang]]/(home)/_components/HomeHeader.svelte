<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { mobileMenu } from "$lib/stores/mobile-menu.svelte";
    import LanguageSwitcher from "../../../_components/LanguageSwitcher.svelte";

    import type { ContentLocale } from "$lib/i18n/types";
    import type { ContentLanguage } from "$lib/types/content-language";

    interface Props {
        currentLang: ContentLocale;
        contentLanguages: ContentLanguage[];
    }

    let { contentLanguages, currentLang }: Props = $props();
</script>

<header
    class="fixed top-0 z-40 w-full border-b border-gray-200 bg-white/95 px-5 backdrop-blur-md transition-colors md:px-10"
>
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between md:h-20">
        <a
            href={resolve(`/${currentLang !== "en-US" ? currentLang : ""}`)}
            class="shrink-0 text-[22px] font-extrabold tracking-tight text-theme-700 transition-colors hover:text-theme-800"
        >
            Aan Refarwan
        </a>

        <div class="flex items-center gap-2">
            <LanguageSwitcher {currentLang} {contentLanguages} />
            <button
                type="button"
                onclick={() => (mobileMenu.open = !mobileMenu.open)}
                aria-expanded={mobileMenu.open}
                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
            >
                <Icon icon="lucide:menu" class="h-6 w-6" />
            </button>
        </div>
    </div>
</header>
