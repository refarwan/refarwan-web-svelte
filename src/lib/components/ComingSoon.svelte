<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { ComingSoonPageTranslation } from "$lib/i18n/coming-soon";

    interface Props {
        type: "blog" | "project";
        t: ComingSoonPageTranslation;
        homeHref: ResolvedPathname;
        watchHref: ResolvedPathname;
    }

    let { type, t, homeHref, watchHref }: Props = $props();

    const icon = $derived(type === "blog" ? "lucide:newspaper" : "lucide:folder-git-2");
</script>

<section
    class="relative flex h-[calc(100vh-60px)] w-full items-center justify-center overflow-hidden md:h-[calc(100vh-80px)]"
>
    <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
    >
        <div class="h-96 w-96 rounded-full bg-theme-400/10 blur-3xl"></div>
        <div
            class="h-80 w-80 -translate-x-20 -translate-y-20 rounded-full bg-indigo-400/10 blur-3xl"
        ></div>
    </div>

    <div class="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div
            class="inline-flex items-center gap-2 rounded-full border border-theme-200/80 bg-theme-50/80 px-4 py-1.5 text-xs font-semibold text-theme-700 shadow-xs backdrop-blur-xs"
        >
            <span class="relative flex h-2 w-2">
                <span
                    class="absolute inline-flex h-full w-full animate-ping rounded-full bg-theme-400 opacity-75"
                ></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-theme-500"></span>
            </span>
            <span>{t.badge}</span>
            <Icon icon="lucide:sparkles" class="h-3.5 w-3.5 text-theme-500" />
        </div>

        <div
            class="mt-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-theme-200 bg-linear-to-b from-theme-50 to-white text-theme-600 shadow-lg shadow-theme-500/10 md:h-24 md:w-24"
        >
            <Icon {icon} class="h-10 w-10 md:h-12 md:w-12" />
        </div>

        <h1
            class="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
        >
            {t.projectTitle}
        </h1>

        <p class="mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
            {t.projectDescription}
        </p>

        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
                href={homeHref}
                class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-theme-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-theme-700 hover:shadow-md sm:w-auto"
            >
                <Icon icon="lucide:arrow-left" class="h-4 w-4" />
                <span>{t.backHome}</span>
            </a>

            <a
                href={watchHref}
                class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:w-auto"
            >
                <Icon icon="lucide:clapperboard" class="h-4 w-4 text-theme-600" />
                <span>{t.exploreWatch}</span>
            </a>
        </div>
    </div>
</section>
