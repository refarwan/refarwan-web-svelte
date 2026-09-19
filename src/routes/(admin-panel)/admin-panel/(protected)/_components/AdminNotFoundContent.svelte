<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";

    import type { AdminTranslation } from "$lib/i18n/admin";

    interface Props {
        t: AdminTranslation["notFound"];
    }

    let { t }: Props = $props();
</script>

<div
    class="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-12 text-center md:py-16 xl:py-20"
>
    <div class="relative flex items-center justify-center">
        <span
            class="text-7xl font-black tracking-tight text-theme-600 select-none md:text-8xl xl:text-9xl"
        >
            404
        </span>
    </div>

    <div class="mt-4 flex flex-col items-center gap-2.5 px-4 md:mt-6 md:gap-3">
        <h2 class="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl xl:text-3xl">
            {t.heading}
        </h2>
        <p class="max-w-md text-sm leading-relaxed text-gray-500 md:text-base">
            {t.subtext}
        </p>
    </div>

    <div class="mt-8 flex items-center justify-center px-4">
        <a
            href={resolve("/admin-panel")}
            class="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-theme-600 px-5 text-sm font-semibold text-white transition-all hover:bg-theme-700"
        >
            <Icon icon="lucide:layout-dashboard" class="h-4 w-4" />
            <span>{t.backToDashboard}</span>
        </a>
    </div>
</div>
