<script lang="ts">
    import { FOOTER_TRANSLATIONS } from "$lib/i18n/footer";
    import Footer from "../_components/Footer.svelte";

    let { children, data } = $props();
</script>

{@render children()}
<Footer t={FOOTER_TRANSLATIONS[data.currentLang]} />
