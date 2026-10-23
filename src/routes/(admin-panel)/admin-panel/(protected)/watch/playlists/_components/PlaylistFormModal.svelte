<script lang="ts">
    import Icon from "@iconify/svelte";
    import { untrack } from "svelte";
    import { formatDuration } from "$lib/utils/watch-format";
    import LanguageTabs from "../../../_components/LanguageTabs.svelte";
    import { axiosErrorMessage } from "../../../../../utils/axios-error-message";
    import { slugify } from "../../../../../utils/slugify";

    import type { ContentLanguage, ContentLocale } from "$lib/types/content-language";
    import type { PlaylistDetail, PlaylistStatus } from "$lib/types/playlist";
    import type { VideoItem } from "$lib/types/video";
    import type { WatchPlaylistTranslationObjects } from "../../../../../i18n/watch-playlist/types";

    interface Props {
        mode: "create" | "edit";
        playlist: PlaylistDetail | null;
        contentLanguages: ContentLanguage[];
        onClose: () => void;
        onCheckSlug: (slug: string, currentSlug?: string) => Promise<string>;
        onFetchAvailableVideos: (search?: string) => Promise<VideoItem[]>;
        onCreate: (formData: FormData) => Promise<void>;
        onUpdate: (id: string, formData: FormData) => Promise<void>;
        t: WatchPlaylistTranslationObjects;
        cancelLabel: string;
    }

    let {
        mode,
        playlist,
        contentLanguages,
        onClose,
        onCheckSlug,
        onFetchAvailableVideos,
        onCreate,
        onUpdate,
        t,
        cancelLabel
    }: Props = $props();

    const defaultLocale = $derived(contentLanguages[0]?.locale ?? "en-US");

    const seedTranslations = () => {
        const initialDefault = contentLanguages[0]?.locale ?? "en-US";
        const titles: Record<string, string> = { [initialDefault]: playlist?.title ?? "" };
        const descriptions: Record<string, string> = {
            [initialDefault]: playlist?.description ?? ""
        };

        for (const lang of contentLanguages) {
            if (lang.locale === initialDefault) continue;
            const translation = playlist?.translations?.find(
                (tr) => tr.languageCode === lang.locale
            );
            titles[lang.locale] = translation?.title ?? "";
            descriptions[lang.locale] = translation?.description ?? "";
        }
        return { titles, descriptions };
    };

    const initialData = seedTranslations();

    let activeLangCode = $state<ContentLocale>(
        untrack(() => contentLanguages[0]?.locale ?? "en-US")
    );
    let titles = $state<Record<string, string>>(initialData.titles);
    let descriptions = $state<Record<string, string>>(initialData.descriptions);

    let slug = $state(untrack(() => playlist?.slug ?? ""));
    let isSlugTouched = $state(untrack(() => Boolean(playlist?.slug)));
    let isCheckingSlug = $state(false);
    let slugTaken = $state(false);
    let suggestedSlug = $state("");

    let status = $state<PlaylistStatus>(untrack(() => playlist?.status ?? "draft"));

    let thumbnailFile = $state<File | null>(null);
    let thumbnailPreview = $state<string | null>(
        untrack(() => playlist?.thumbnail?.medium || playlist?.thumbnail?.small || null)
    );
    let removeThumbnail = $state(false);

    type SelectedVideo = {
        id: string;
        title: string;
        duration?: number;
        thumbnail?: { small?: string; medium?: string } | null;
    };

    let selectedVideos = $state<SelectedVideo[]>(
        untrack(() => {
            if (!playlist?.videos) return [];
            return playlist.videos.map((v) => ({
                id: v.videoId,
                title: v.title,
                duration: v.duration,
                thumbnail: v.thumbnail
            }));
        })
    );

    let videoSearchQuery = $state("");
    let availableVideos = $state<VideoItem[]>([]);
    let isSearchingVideos = $state(false);
    let showVideoDropdown = $state(false);
    let videoSearchDebounce: ReturnType<typeof setTimeout> | undefined;

    let submitting = $state(false);
    let formError = $state("");
    let slugCheckTimeout: ReturnType<typeof setTimeout> | undefined;

    const verifySlug = async (targetSlug: string, isAutoFromTitle: boolean): Promise<string> => {
        const clean = slugify(targetSlug);
        if (!clean) {
            slugTaken = false;
            suggestedSlug = "";
            isCheckingSlug = false;
            return clean;
        }

        isCheckingSlug = true;
        try {
            const availableSlug = await onCheckSlug(clean, playlist?.slug);
            if (isAutoFromTitle) {
                if (!isSlugTouched) {
                    slug = availableSlug;
                    slugTaken = false;
                    suggestedSlug = "";
                }
            } else if (availableSlug !== clean) {
                slugTaken = true;
                suggestedSlug = availableSlug;
            } else {
                slugTaken = false;
                suggestedSlug = "";
            }
            return availableSlug;
        } catch {
            slugTaken = false;
            return clean;
        } finally {
            isCheckingSlug = false;
        }
    };

    const onTitleInput = (value: string) => {
        titles[activeLangCode] = value;
        if (activeLangCode === defaultLocale && !isSlugTouched) {
            clearTimeout(slugCheckTimeout);
            slugCheckTimeout = setTimeout(() => {
                void verifySlug(value, true);
            }, 300);
        }
    };

    const onSlugInput = (value: string) => {
        isSlugTouched = true;
        slug = value;
        clearTimeout(slugCheckTimeout);
        slugCheckTimeout = setTimeout(() => {
            void verifySlug(value, false);
        }, 350);
    };

    const useSuggestedSlug = () => {
        if (!suggestedSlug) return;
        slug = suggestedSlug;
        slugTaken = false;
        suggestedSlug = "";
    };

    const handleThumbnailSelect = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            thumbnailFile = file;
            removeThumbnail = false;
            thumbnailPreview = URL.createObjectURL(file);
        }
    };

    const handleRemoveThumbnail = () => {
        thumbnailFile = null;
        thumbnailPreview = null;
        removeThumbnail = true;
    };

    const searchVideos = (query: string) => {
        clearTimeout(videoSearchDebounce);
        videoSearchDebounce = setTimeout(async () => {
            isSearchingVideos = true;
            try {
                const results = await onFetchAvailableVideos(query);
                const selectedIds = new Set(selectedVideos.map((v) => v.id));
                availableVideos = results.filter((v) => !selectedIds.has(v.id));
            } finally {
                isSearchingVideos = false;
            }
        }, 300);
    };

    const addVideo = (v: VideoItem) => {
        selectedVideos = [
            ...selectedVideos,
            {
                id: v.id,
                title: v.title ?? "Untitled Video",
                thumbnail: v.thumbnail
            }
        ];
        availableVideos = availableVideos.filter((item) => item.id !== v.id);
        videoSearchQuery = "";
        showVideoDropdown = false;
    };

    const removeVideoItem = (id: string) => {
        selectedVideos = selectedVideos.filter((v) => v.id !== id);
    };

    const moveVideo = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === selectedVideos.length - 1)
        ) {
            return;
        }
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const newArr = [...selectedVideos];
        const temp = newArr[index];
        newArr[index] = newArr[targetIndex];
        newArr[targetIndex] = temp;
        selectedVideos = newArr;
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        formError = "";

        const defaultTitle = titles[defaultLocale]?.trim();
        if (!defaultTitle) {
            formError = t.nameRequired;
            return;
        }

        const cleanSlug = slugify(slug);
        if (!cleanSlug) {
            formError = t.slugLabel + " is required";
            return;
        }

        submitting = true;
        try {
            const formData = new FormData();
            formData.append("title", defaultTitle);
            formData.append("description", (descriptions[defaultLocale] ?? "").trim());
            formData.append("slug", cleanSlug);
            formData.append("status", status);

            const defaultDesc = (descriptions[defaultLocale] ?? "").trim();
            const translationsPayload = contentLanguages.map((lang) => {
                const currentTitle = (titles[lang.locale] ?? "").trim();
                const currentDesc = (descriptions[lang.locale] ?? "").trim();
                return {
                    languageCode: lang.locale,
                    title: currentTitle || defaultTitle,
                    description: currentDesc || defaultDesc
                };
            });
            formData.append("translations", JSON.stringify(translationsPayload));

            const videoIds = selectedVideos.map((v) => v.id);
            formData.append("videoIds", JSON.stringify(videoIds));

            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }
            if (removeThumbnail) {
                formData.append("removeThumbnail", "true");
            }

            if (mode === "create") {
                await onCreate(formData);
            } else if (playlist) {
                await onUpdate(playlist.id, formData);
            }
            onClose();
        } catch (err) {
            formError = axiosErrorMessage(err, mode === "create" ? t.createFailed : t.updateFailed);
        } finally {
            submitting = false;
        }
    };
</script>

<div
    class="w-[92vw] max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
>
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <h2 class="text-base font-semibold text-gray-900">
            {mode === "create" ? t.addModalTitle : t.editModalTitle}
        </h2>
        <button
            type="button"
            onclick={onClose}
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label={t.closeModal}
        >
            <Icon icon="lucide:x" class="h-5 w-5" />
        </button>
    </div>

    <!-- Form -->
    <form
        onsubmit={handleSubmit}
        class="max-h-[calc(85vh-120px)] space-y-5 overflow-y-auto bg-white p-6"
    >
        {#if formError}
            <div
                class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-600"
            >
                <Icon icon="lucide:alert-circle" class="h-5 w-5 shrink-0 text-red-500" />
                <span>{formError}</span>
            </div>
        {/if}

        <!-- Language Tabs -->
        <div>
            <LanguageTabs
                languages={contentLanguages}
                activeCode={activeLangCode}
                onSelect={(code: ContentLocale) => (activeLangCode = code)}
            />
        </div>

        <!-- Title & Description (Per Language) -->
        <div class="space-y-4 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <div>
                <label
                    for="playlist-title"
                    class="mb-1.5 block text-xs font-semibold tracking-wider text-gray-700 uppercase"
                >
                    {t.nameLabel} ({activeLangCode})
                    {#if activeLangCode === defaultLocale}<span class="text-red-500">*</span>{/if}
                </label>
                <input
                    id="playlist-title"
                    type="text"
                    value={titles[activeLangCode] ?? ""}
                    oninput={(e) => onTitleInput(e.currentTarget.value)}
                    placeholder={t.namePlaceholder}
                    class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>

            <div>
                <label
                    for="playlist-desc"
                    class="mb-1.5 block text-xs font-semibold tracking-wider text-gray-700 uppercase"
                >
                    {t.descriptionLabel} ({activeLangCode})
                </label>
                <textarea
                    id="playlist-desc"
                    rows="3"
                    value={descriptions[activeLangCode] ?? ""}
                    oninput={(e) => (descriptions[activeLangCode] = e.currentTarget.value)}
                    placeholder={t.descriptionPlaceholder}
                    class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                ></textarea>
            </div>
        </div>

        <!-- Slug & Status Grid -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label
                    for="playlist-slug"
                    class="mb-1.5 block text-xs font-semibold tracking-wider text-gray-700 uppercase"
                >
                    {t.slugLabel} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <input
                        id="playlist-slug"
                        type="text"
                        value={slug}
                        oninput={(e) => onSlugInput(e.currentTarget.value)}
                        placeholder="my-playlist-slug"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                    />
                    <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                        {#if isCheckingSlug}
                            <Icon
                                icon="lucide:loader-2"
                                class="h-4 w-4 animate-spin text-gray-400"
                            />
                        {:else if slugTaken}
                            <Icon icon="lucide:alert-circle" class="h-4 w-4 text-amber-500" />
                        {:else if slug}
                            <Icon icon="lucide:check" class="h-4 w-4 text-emerald-600" />
                        {/if}
                    </div>
                </div>
                {#if slugTaken && suggestedSlug}
                    <p class="mt-1.5 text-xs text-amber-600">
                        {t.slugTakenLabel}
                        <button
                            type="button"
                            onclick={useSuggestedSlug}
                            class="ml-1 cursor-pointer font-medium text-gray-900 underline hover:text-gray-700"
                        >
                            {suggestedSlug}
                        </button>
                    </p>
                {/if}
            </div>

            <div>
                <label
                    for="playlist-status"
                    class="mb-1.5 block text-xs font-semibold tracking-wider text-gray-700 uppercase"
                >
                    {t.statusLabel}
                </label>
                <select
                    id="playlist-status"
                    bind:value={status}
                    class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
        </div>

        <!-- Custom Thumbnail Upload (Optional) -->
        <div>
            <span class="mb-1.5 block text-xs font-semibold tracking-wider text-gray-700 uppercase">
                {t.thumbnailLabel}
            </span>
            <div class="flex items-start gap-4">
                {#if thumbnailPreview}
                    <div
                        class="group relative h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                    >
                        <img
                            src={thumbnailPreview}
                            alt="Thumbnail Preview"
                            class="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onclick={handleRemoveThumbnail}
                            class="absolute top-1.5 right-1.5 rounded-full bg-red-600 p-1 text-white shadow-sm transition-opacity hover:bg-red-700"
                            title="Remove cover"
                        >
                            <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                        </button>
                    </div>
                {/if}
                <div class="flex-1">
                    <label
                        class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/70 p-4 text-center transition-colors hover:border-gray-400 hover:bg-gray-100/60"
                    >
                        <Icon icon="lucide:image-plus" class="mb-1 h-6 w-6 text-gray-400" />
                        <span class="text-xs font-medium text-gray-800">Upload custom cover</span>
                        <span class="mt-0.5 text-[11px] text-gray-400">{t.thumbnailHint}</span>
                        <input
                            type="file"
                            accept="image/*"
                            class="hidden"
                            onchange={handleThumbnailSelect}
                        />
                    </label>
                </div>
            </div>
        </div>

        <!-- Video Picker & Ordering -->
        <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
                <div>
                    <span
                        class="block text-xs font-semibold tracking-wider text-gray-700 uppercase"
                    >
                        {t.selectVideosLabel} ({selectedVideos.length})
                    </span>
                    <p class="text-xs text-gray-400">{t.reorderVideosHint}</p>
                </div>
            </div>

            <!-- Video Search Input & Dropdown -->
            <div class="relative">
                <div class="relative">
                    <Icon
                        icon="lucide:search"
                        class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        bind:value={videoSearchQuery}
                        onfocus={() => {
                            showVideoDropdown = true;
                            if (availableVideos.length === 0) searchVideos("");
                        }}
                        oninput={(e) => {
                            showVideoDropdown = true;
                            searchVideos(e.currentTarget.value);
                        }}
                        placeholder={t.searchVideoPlaceholder}
                        class="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 placeholder-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                    />
                </div>

                {#if showVideoDropdown}
                    <div
                        class="absolute top-full right-0 left-0 z-20 mt-1.5 max-h-60 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl"
                    >
                        {#if isSearchingVideos}
                            <div class="p-3 text-center text-xs text-gray-400">
                                Loading videos...
                            </div>
                        {:else if availableVideos.length === 0}
                            <div class="p-3 text-center text-xs text-gray-400">
                                No videos available to add
                            </div>
                        {:else}
                            {#each availableVideos as v (v.id)}
                                <button
                                    type="button"
                                    onclick={() => addVideo(v)}
                                    class="flex w-full cursor-pointer items-center justify-between p-2.5 text-left transition-colors hover:bg-gray-50"
                                >
                                    <div class="flex min-w-0 items-center gap-2.5">
                                        {#if v.thumbnail?.small}
                                            <img
                                                src={v.thumbnail.small}
                                                alt=""
                                                class="h-8 w-14 shrink-0 rounded object-cover ring-1 ring-gray-200"
                                            />
                                        {/if}
                                        <span class="truncate text-xs font-medium text-gray-900"
                                            >{v.title}</span
                                        >
                                    </div>
                                    <div class="ml-2 flex shrink-0 items-center gap-2">
                                        <Icon icon="lucide:plus" class="h-4 w-4 text-gray-400" />
                                    </div>
                                </button>
                            {/each}
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Selected Videos List -->
            <div
                class="max-h-64 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 bg-white"
            >
                {#if selectedVideos.length === 0}
                    <div class="p-6 text-center text-xs text-gray-400">
                        <Icon
                            icon="lucide:list-video"
                            class="mx-auto mb-1.5 h-6 w-6 text-gray-300"
                        />
                        {t.noVideosSelected}
                    </div>
                {:else}
                    {#each selectedVideos as video, idx (video.id)}
                        <div
                            class="flex items-center gap-3 p-2.5 transition-colors hover:bg-gray-50/80"
                        >
                            <span
                                class="w-6 shrink-0 text-center font-mono text-xs font-medium text-gray-400"
                            >
                                {idx + 1}
                            </span>
                            {#if video.thumbnail?.small || video.thumbnail?.medium}
                                <img
                                    src={video.thumbnail.small || video.thumbnail.medium}
                                    alt=""
                                    class="h-9 w-16 shrink-0 rounded object-cover ring-1 ring-gray-200"
                                />
                            {:else}
                                <div
                                    class="flex h-9 w-16 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-400"
                                >
                                    <Icon icon="lucide:video" class="h-4 w-4" />
                                </div>
                            {/if}
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-xs font-medium text-gray-900">
                                    {video.title}
                                </p>
                                {#if video.duration}
                                    <p class="text-[11px] text-gray-400">
                                        {formatDuration(video.duration)}
                                    </p>
                                {/if}
                            </div>
                            <div class="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    disabled={idx === 0}
                                    onclick={() => moveVideo(idx, "up")}
                                    class="cursor-pointer rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-30"
                                    title={t.moveUp}
                                >
                                    <Icon icon="lucide:arrow-up" class="h-3.5 w-3.5" />
                                </button>
                                <button
                                    type="button"
                                    disabled={idx === selectedVideos.length - 1}
                                    onclick={() => moveVideo(idx, "down")}
                                    class="cursor-pointer rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-30"
                                    title={t.moveDown}
                                >
                                    <Icon icon="lucide:arrow-down" class="h-3.5 w-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onclick={() => removeVideoItem(video.id)}
                                    class="cursor-pointer rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                    title={t.removeVideo}
                                >
                                    <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>

        <!-- Footer Buttons -->
        <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button
                type="button"
                onclick={onClose}
                class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                disabled={submitting}
                class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-theme-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-theme-700 disabled:opacity-50"
            >
                {#if submitting}
                    <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
                {/if}
                <span>{mode === "create" ? t.savePlaylist : t.saveChanges}</span>
            </button>
        </div>
    </form>
</div>
