<script lang="ts">
    import Icon from "@iconify/svelte";
    import ImageDetailFooter from "./ImageDetailFooter.svelte";
    import ImageDetailHeader from "./ImageDetailHeader.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { AdminTranslation } from "$lib/i18n/admin";
    import type { ImageLibraryItem } from "$lib/types/image-library";

    type Variant = "large" | "medium" | "small";

    interface Props {
        item: ImageLibraryItem;
        isEn?: boolean;
        onClose: () => void;
        onDelete?: () => void;
        t: AdminTranslation["imageLibrary"];
    }

    let { item, isEn = true, onClose, onDelete, t }: Props = $props();

    let activeVariant = $state<Variant>("large");
    let copied = $state(false);
    let copyTimeout: ReturnType<typeof setTimeout> | undefined;

    const variants: { key: Variant; label: string }[] = [
        { key: "large", label: "Large" },
        { key: "medium", label: "Medium" },
        { key: "small", label: "Small" }
    ];

    const currentUrl = $derived((item.source[activeVariant] || "") as ResolvedPathname);

    const copyUrl = async () => {
        if (!currentUrl) return;
        try {
            await navigator.clipboard.writeText(currentUrl);
            copied = true;
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                copied = false;
            }, 2000);
        } catch {
            // fallback
        }
    };

    const formattedDate = $derived.by(() => {
        try {
            return new Date(item.createdAt).toLocaleDateString(isEn ? "en-US" : "id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return item.createdAt;
        }
    });
</script>

<div
    class="flex h-auto max-h-[90vh] w-[94vw] max-w-89.5 flex-col overflow-hidden rounded-xl bg-white sm:max-w-125 md:max-w-150"
    role="dialog"
    aria-modal="true"
>
    <ImageDetailHeader title={t.detailModalTitle} closeTitle={t.closeModal} {onClose} />

    <!-- Body (Scrollable) -->
    <div
        class="flex min-h-0 w-full flex-1 flex-col items-start gap-5 overflow-y-auto px-6 py-5 select-text"
    >
        <!-- Variant Tabs -->
        <div
            class="flex w-full shrink-0 items-center gap-1.5 overflow-x-auto rounded-full whitespace-nowrap"
        >
            {#each variants as v (v.key)}
                {@const isActive = activeVariant === v.key}
                <button
                    type="button"
                    onclick={() => (activeVariant = v.key)}
                    class={`flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full px-3 py-1 text-[12px] transition-colors ${isActive ? "bg-theme-600 font-medium text-white " : "font-semibold text-gray-500 hover:bg-gray-100"}`}
                >
                    <span>{v.label}</span>
                </button>
            {/each}
        </div>

        <!-- 16:9 Centered Black Box Preview without Cropping -->
        <div
            class="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black"
        >
            <img
                src={currentUrl || item.source.large || item.source.medium || item.source.small}
                alt="Detail preview"
                class="h-full w-full object-contain object-center"
            />
        </div>

        <!-- Upload Date & Image ID -->
        <div class="grid w-full shrink-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="flex flex-col items-start gap-1">
                <p class="text-[12px] font-medium text-gray-500">
                    {t.uploadedAt}
                </p>
                <span class="text-[13px] font-medium text-gray-700">
                    {formattedDate}
                </span>
            </div>

            <div class="flex flex-col items-start gap-1">
                <p class="text-[12px] font-medium text-gray-500">ID</p>
                <span
                    class="max-w-full truncate font-mono text-[12px] font-medium text-gray-700 select-all"
                >
                    {item.id}
                </span>
            </div>
        </div>

        <!-- URL Copy Section -->
        <div class="w-full space-y-1.5">
            <p class="text-[12px] font-medium text-gray-700">
                {t.copyUrl} ({activeVariant.toUpperCase()})
            </p>
            <div
                class="flex w-full items-stretch overflow-hidden rounded-lg border border-gray-300"
            >
                <div
                    class="flex h-8.75 min-w-0 flex-1 items-center overflow-x-auto bg-gray-50 px-3 py-2"
                >
                    <p class="font-mono text-[11px] whitespace-nowrap text-gray-500 select-all">
                        {currentUrl}
                    </p>
                </div>
                <button
                    type="button"
                    onclick={copyUrl}
                    class="flex shrink-0 cursor-pointer items-center justify-center gap-1 bg-theme-600 px-3 py-2 text-white transition-colors hover:bg-theme-700"
                >
                    {#if copied}
                        <Icon icon="lucide:check" class="size-3.5" />
                        <p class="text-[11px] font-medium whitespace-nowrap">
                            {t.copied}
                        </p>
                    {:else}
                        <Icon icon="lucide:copy" class="size-3.5" />
                        <p class="text-[11px] font-medium whitespace-nowrap">
                            {t.copyUrl}
                        </p>
                    {/if}
                </button>
            </div>
        </div>
    </div>

    <ImageDetailFooter
        {currentUrl}
        closeLabel={t.closeModal}
        deleteLabel={t.delete}
        openLabel={isEn ? "Open Image" : "Buka Gambar"}
        {onClose}
        {onDelete}
    />
</div>
