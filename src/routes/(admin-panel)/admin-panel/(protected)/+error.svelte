<script lang="ts">
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { getAdminTranslation } from "$lib/i18n/admin";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import AdminNotFoundContent from "./_components/AdminNotFoundContent.svelte";

    const adminTranslation = $derived(getAdminTranslation(page.data.adminLang));
    const notFoundT = $derived(adminTranslation.notFound);

    $effect(() => {
        pageTitleStore.set(adminTranslation.shell.notFound);
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
