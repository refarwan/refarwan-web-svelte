<script lang="ts">
    import type { CtaTranslation } from "$lib/i18n/home";

    interface Props {
        t: CtaTranslation;
    }

    let { t }: Props = $props();
</script>

<section id="contact" class="w-full bg-white py-12 md:py-16 lg:py-20">
    <div class="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <div
            class="flex flex-col items-center justify-between gap-8 rounded-3xl bg-theme-700 px-8 py-10 text-center text-white md:flex-row md:px-12 md:py-14 md:text-left"
        >
            <div class="max-w-xl">
                <h2 class="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">
                    {t.title}
                </h2>
                <p class="mt-3 text-sm leading-relaxed text-theme-100 md:text-base">
                    {t.description}
                </p>
            </div>

            <a
                href="https://wa.me/6287777422425"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-13 shrink-0 items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-theme-700 transition-colors hover:bg-theme-50"
            >
                {t.button}
            </a>
        </div>
    </div>
</section>
