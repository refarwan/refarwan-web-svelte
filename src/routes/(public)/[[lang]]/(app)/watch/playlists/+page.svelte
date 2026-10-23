<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { env } from "$env/dynamic/public";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import { WATCH_TRANSLATIONS } from "$lib/i18n/watch";
    import { formatDuration } from "$lib/utils/watch-format";
    import AppMainSection from "../../_components/AppMainSection.svelte";
    import LoadMoreButton from "../../_components/LoadMoreButton.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { ListResponse } from "$lib/types/api-response";
    import type { PublicPlaylistItem } from "$lib/types/playlist";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(WATCH_TRANSLATIONS[currentLang]);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/watch`);

    let playlists = $derived(data.playlists);
    let currentPage = $derived(data.currentPage);
    let totalPage = $derived(data.totalPage);
    let loading = $state(false);

    const hasMore = $derived(currentPage < totalPage);

    const handleLoadMore = async () => {
        if (loading || !hasMore) return;
        loading = true;
        try {
            const nextPage = currentPage + 1;
            const query = new SvelteURLSearchParams({ page: `${nextPage}`, limit: "12" });

            const apiUrl = env.PUBLIC_API_URL || "http://localhost:3000";
            const res = await fetch(`${apiUrl}/playlist/public?${query.toString()}`, {
                headers: { "Accept-Language": currentLang }
            });

            if (res.ok) {
                const json = (await res.json()) as ListResponse<PublicPlaylistItem[]>;
                playlists = [...playlists, ...(json.data ?? [])];
                currentPage = json.currentPage ?? nextPage;
                totalPage = json.totalPage ?? totalPage;
            }
        } catch (err) {
            console.error("Failed to load more playlists:", err);
        } finally {
            loading = false;
        }
    };

    const buildPlaylistHref = (slug: string): ResolvedPathname =>
        `${basePath}/playlist/${slug}` as ResolvedPathname;
</script>

<svelte:head>
    <title>{t.playlists} | {data.metadata.title} Watch</title>
    <meta name="description" content="Explore curated video playlists." />
</svelte:head>

<AppMainSection>
    <div class="space-y-6">
        <!-- Top Navigation Bar between Videos & Playlists -->
        <div class="flex items-center justify-between border-b border-gray-200 pb-4">
            <div class="flex items-center gap-3">
                <a
                    href={resolve(basePath as ResolvedPathname)}
                    class="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                    {t.categoriesAll}
                </a>
                <span
                    class="rounded-full bg-theme-600 px-4 py-1.5 text-sm font-semibold text-white shadow-xs"
                >
                    {t.playlists}
                </span>
            </div>
            <div class="text-xs text-gray-400">
                {playlists.length}
                {t.playlists}
            </div>
        </div>

        <!-- Playlists Grid -->
        {#if playlists.length === 0}
            <div class="py-20 text-center text-sm text-gray-400">
                <Icon icon="lucide:list-video" class="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p class="font-medium text-gray-700">{t.noPlaylists}</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {#each playlists as item (item.id)}
                    <a
                        href={buildPlaylistHref(item.slug)}
                        class="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
                    >
                        <!-- Thumbnail with stacked effect -->
                        <div class="relative aspect-video w-full overflow-hidden bg-gray-100">
                            {#if item.thumbnail?.medium || item.thumbnail?.small}
                                <img
                                    src={item.thumbnail.medium || item.thumbnail.small}
                                    alt={item.title}
                                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            {:else}
                                <div
                                    class="flex h-full w-full items-center justify-center text-gray-400"
                                >
                                    <Icon icon="lucide:list-video" class="h-10 w-10" />
                                </div>
                            {/if}

                            <!-- Overlay Playlist side badge (Spotify/YouTube style) -->
                            <div
                                class="absolute inset-y-0 right-0 flex w-1/3 flex-col items-center justify-center gap-1 border-l border-white/20 bg-black/60 text-white backdrop-blur-xs"
                            >
                                <Icon icon="lucide:list-video" class="h-5 w-5" />
                                <span class="text-xs font-semibold">{item.videoCount}</span>
                            </div>
                        </div>

                        <!-- Content Info -->
                        <div class="flex flex-1 flex-col justify-between space-y-2 p-4">
                            <div>
                                <h3
                                    class="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-theme-600"
                                >
                                    {item.title}
                                </h3>
                                {#if item.description}
                                    <p class="mt-1 line-clamp-2 text-xs text-gray-500">
                                        {item.description}
                                    </p>
                                {/if}
                            </div>

                            <div
                                class="flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-400"
                            >
                                <span>{item.videoCount} {t.videosSuffix || "videos"}</span>
                                <span class="font-mono">{formatDuration(item.totalDuration)}</span>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}

        <LoadMoreButton
            {hasMore}
            {loading}
            label={t.loadMore}
            loadingLabel={t.loading}
            onloadmore={handleLoadMore}
        />
    </div>
</AppMainSection>
