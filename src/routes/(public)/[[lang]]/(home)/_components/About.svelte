<script lang="ts">
    import type { AboutTranslation } from "$lib/i18n/home";

    interface Props {
        t: AboutTranslation;
    }

    let { t }: Props = $props();
</script>

<section id="about" class="w-full bg-theme-50 py-16 md:py-20 lg:py-28">
    <div class="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div class="flex flex-col">
                <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                    {t.title}
                </h2>
                <p class="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
                    {t.bio1}
                </p>
                <p class="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
                    {t.bio2}
                </p>
            </div>

            <div class="flex flex-col">
                <h3 class="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                    {t.experienceTitle}
                </h3>
                <div class="mt-6 flex flex-col gap-4 md:gap-5">
                    {#each t.experiences as exp (exp.role)}
                        <div class="rounded-2xl border border-theme-100 bg-white p-6">
                            <div class="flex items-center justify-between gap-4">
                                <h4 class="text-lg font-bold text-gray-900">{exp.role}</h4>
                                <span
                                    class="h-2 w-2 shrink-0 rounded-full bg-theme-500"
                                    aria-hidden="true"
                                ></span>
                            </div>
                            <p class="mt-1 text-base font-semibold text-theme-600">{exp.company}</p>
                            <p class="mt-1 text-sm text-gray-500">{exp.period}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>
