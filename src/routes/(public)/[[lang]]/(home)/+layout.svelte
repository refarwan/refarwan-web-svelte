<script lang="ts">
    import { HOME_NAV_TRANSLATIONS } from "$lib/i18n/home-nav.js";
    import HomeHeader from "./_components/HomeHeader.svelte";
    import HomeNavigation from "./_components/HomeNavigation.svelte";

    let { children, data } = $props();
</script>

<HomeHeader currentLang={data.currentLang} contentLanguages={data.contentLanguages} />
<HomeNavigation currentLang={data.currentLang} t={HOME_NAV_TRANSLATIONS[data.currentLang]} />
<main class="mx-auto min-h-screen w-full max-w-7xl pt-16 md:pt-20">
    {@render children()}
</main>
