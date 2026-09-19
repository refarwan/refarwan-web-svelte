<script lang="ts">
    import SocialIcons from "./SocialIcons.svelte";

    import type { FooterTranslation } from "$lib/i18n/footer";

    interface Props {
        t: FooterTranslation;
    }

    let { t }: Props = $props();
</script>

<footer class="w-full bg-gray-900 px-5 py-5 md:px-10 md:py-10 lg:px-10 lg:py-16">
    <div class="mx-auto flex max-w-300 flex-col gap-10">
        <div
            class="flex flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left"
        >
            <div class="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
                <h2 class="text-2xl leading-9 font-extrabold text-white">Aan Refarwan</h2>
                <p class="max-w-120 text-[15px] leading-6 font-normal text-gray-400">
                    {t.bio}
                </p>
            </div>
            <div class="flex flex-col items-center gap-4 text-center lg:items-end lg:text-right">
                <h3 class="leading-5.625 text-[15px] font-semibold text-white">
                    {t.socialTitle}
                </h3>
                <SocialIcons class="justify-center lg:justify-end" />
            </div>
        </div>
        <div class="h-px w-full bg-gray-200/30"></div>
        <div
            class="flex flex-col items-center justify-between gap-3 text-center text-sm leading-5.25 text-gray-400 md:flex-row md:text-left"
        >
            <p>{t.copyright}</p>
            <p>{t.location}</p>
        </div>
    </div>
</footer>
