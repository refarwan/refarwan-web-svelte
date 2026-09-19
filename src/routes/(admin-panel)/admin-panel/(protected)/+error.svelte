<script lang="ts">
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { NOT_FOUND_TRANSLATIONS } from "../../i18n/not-found";
    import { SHELL_TRANSLATIONS } from "../../i18n/shell";
    import { pageTitleStore } from "../../stores/page-title.svelte";
    import AdminNotFoundContent from "./_components/AdminNotFoundContent.svelte";

    import type { AdminLocale } from "../../i18n/types";

    const currentLang = $derived(page.data.currentLang as AdminLocale);
    const notFoundT = $derived(NOT_FOUND_TRANSLATIONS[currentLang]);

    $effect(() => {
        pageTitleStore.set(SHELL_TRANSLATIONS[currentLang].notFound);
    });
</script>

{#if page.status === 404}
    <AdminNotFoundContent t={notFoundT} />
{:else}
    <div
        class="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 text-center"
    >
        <span class="text-6xl font-black tracking-tight text-theme-600 select-none"
            >{page.status}</span
        >
        <p class="mt-4 text-sm leading-relaxed text-gray-500">
            {page.error?.message ?? "Something went wrong."}
        </p>
        <a
            href={resolve("/admin-panel")}
            class="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-theme-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-theme-700"
        >
            {notFoundT.backToDashboard}
        </a>
    </div>
{/if}
