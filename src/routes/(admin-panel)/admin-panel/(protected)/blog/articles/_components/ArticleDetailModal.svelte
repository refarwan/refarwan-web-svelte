<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import CategoryBadge from "./CategoryBadge.svelte";
    import StatusBadge from "./StatusBadge.svelte";

    import type { ArticleDetail } from "$lib/types/article";

    interface Props {
        t: Record<string, string>;
        article: ArticleDetail;
        onClose: () => void;
        isEn?: boolean;
    }

    let { t, article, onClose, isEn = true }: Props = $props();

    const formattedDate = $derived(
        new Date(article.createdAt).toLocaleDateString(isEn ? "en-US" : "id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    );

    const editHref = $derived(
        resolve(`/admin-panel/blog/articles/edit/${article.id}` as `/${string}`)
    );

    let activeLangTab = $state<string>("en");
    const activeTranslation = $derived(
        article.translations.find((tr) => tr.languageCode === activeLangTab)
    );

    const displayTitle = $derived(
        activeLangTab === "en" ? article.title : activeTranslation?.title || article.title
    );
    const displayShortDesc = $derived(
        activeLangTab === "en"
            ? article.shortDescription
            : activeTranslation?.shortDescription || article.shortDescription
    );
</script>

<!-- Backdrop -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 bg-black/60 backdrop-blur-xs" onclick={onClose}></div>

    <!-- Modal Box -->
    <div class="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 class="text-base font-semibold text-gray-900">{t.detailModalTitle}</h3>
            <button
                type="button"
                onclick={onClose}
                class="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
                <Icon icon="lucide:x" class="h-5 w-5" />
            </button>
        </div>

        <!-- Content Body -->
        <div class="space-y-5 p-6">
            <!-- Thumbnail Banner -->
            {#if article.thumbnail}
                <div
                    class="aspect-video w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-900"
                >
                    <img
                        src={article.thumbnail.medium || article.thumbnail.large}
                        alt={article.title ?? "Article Thumbnail"}
                        class="h-full w-full object-cover object-center"
                    />
                </div>
            {/if}

            <!-- Language Tabs (if has translations) -->
            {#if article.translations.length > 0}
                <div class="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <button
                        type="button"
                        onclick={() => (activeLangTab = "en")}
                        class={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeLangTab === "en" ? "bg-theme-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        English
                    </button>
                    {#each article.translations as tr (tr.languageCode)}
                        <button
                            type="button"
                            onclick={() => (activeLangTab = tr.languageCode)}
                            class={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeLangTab === tr.languageCode ? "bg-theme-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                            {tr.languageCode.toUpperCase()}
                        </button>
                    {/each}
                </div>
            {/if}

            <!-- Badges and Info -->
            <div class="flex flex-wrap items-center gap-2">
                <CategoryBadge category={article.category} />
                <StatusBadge status={article.status} lang={isEn ? "en" : "id"} />
            </div>

            <!-- Title -->
            <h2 class="text-xl font-bold text-gray-900">{displayTitle}</h2>

            <!-- Short Description -->
            {#if displayShortDesc}
                <p class="text-sm leading-relaxed text-gray-600">{displayShortDesc}</p>
            {/if}

            <!-- Metadata Cards -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div class="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                    <span class="text-xs font-medium text-gray-400">{t.publishedOnLabel}</span>
                    <p class="mt-1 text-sm font-semibold text-gray-800">{formattedDate}</p>
                </div>

                <div class="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                    <span class="text-xs font-medium text-gray-400">{t.tableReads}</span>
                    <p class="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                        <Icon icon="lucide:eye" class="h-4 w-4 text-gray-400" />
                        {article.readsCount.toLocaleString()}
                        {t.readsSuffix}
                    </p>
                </div>

                {#if article.author}
                    <div
                        class="col-span-2 rounded-xl border border-gray-100 bg-gray-50/70 p-3 sm:col-span-1"
                    >
                        <span class="text-xs font-medium text-gray-400">{t.authorLabel}</span>
                        <p class="mt-1 text-sm font-semibold text-gray-800">
                            {article.author.fullname}
                        </p>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
                type="button"
                onclick={onClose}
                class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
                {t.closeLabel}
            </button>

            <a
                href={editHref}
                class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-theme-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-theme-700"
            >
                <Icon icon="lucide:square-pen" class="h-4 w-4" />
                <span>{t.editArticleLabel}</span>
            </a>
        </div>
    </div>
</div>
