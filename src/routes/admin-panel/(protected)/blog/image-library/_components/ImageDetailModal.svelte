<script lang="ts">
    import { Check as CheckIcon, Copy as CopyIcon, X as XIcon } from "lucide-svelte/icons";

    import type { AdminTranslation } from "$lib/i18n/admin";
    import type { ImageLibraryItem } from "$lib/types";

    interface Props {
        item: ImageLibraryItem;
        onClose: () => void;
        t: AdminTranslation["imageLibrary"];
    }

    let { item, onClose, t }: Props = $props();

    type Variant = "large" | "medium" | "small";
    let activeVariant = $state<Variant>("large");
    let copied = $state(false);
    let copyTimeout: ReturnType<typeof setTimeout> | undefined;

    const currentUrl = $derived(item.source[activeVariant] || "");

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

    const formatDate = (iso: string): string => {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return iso;
        }
    };
</script>

<div
    class="w-[94vw] max-w-160 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl md:w-160"
>
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">{t.detailModalTitle}</h3>
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title={t.closeModal}
        >
            <XIcon class="h-5 w-5" />
        </button>
    </div>

    <div class="space-y-5 p-6">
        <div
            class="relative flex max-h-72 w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-900/5 p-2"
        >
            <img
                src={currentUrl || item.source.large || item.source.medium}
                alt="Detail preview"
                class="max-h-68 max-w-full rounded-lg object-contain"
            />
        </div>

        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold tracking-wider text-gray-500 uppercase"
                    >Variants</span
                >
                <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs">
                    <button
                        type="button"
                        onclick={() => (activeVariant = "large")}
                        class={`cursor-pointer rounded-md px-3 py-1 font-medium transition-colors ${
                            activeVariant === "large"
                                ? "bg-white text-gray-900 shadow-2xs"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Large
                    </button>
                    <button
                        type="button"
                        onclick={() => (activeVariant = "medium")}
                        class={`cursor-pointer rounded-md px-3 py-1 font-medium transition-colors ${
                            activeVariant === "medium"
                                ? "bg-white text-gray-900 shadow-2xs"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Medium
                    </button>
                    <button
                        type="button"
                        onclick={() => (activeVariant = "small")}
                        class={`cursor-pointer rounded-md px-3 py-1 font-medium transition-colors ${
                            activeVariant === "small"
                                ? "bg-white text-gray-900 shadow-2xs"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Small
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <input
                    type="text"
                    readonly
                    value={currentUrl}
                    class="w-full rounded-lg border border-gray-300 bg-gray-50/70 px-3.5 py-2 font-mono text-xs text-gray-800 select-all focus:border-theme-500 focus:outline-none"
                />
                <button
                    type="button"
                    onclick={copyUrl}
                    class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition-colors hover:bg-gray-50"
                >
                    {#if copied}
                        <CheckIcon class="h-3.5 w-3.5 text-green-600" />
                        <span class="text-green-600">{t.copied}</span>
                    {:else}
                        <CopyIcon class="h-3.5 w-3.5 text-gray-500" />
                        <span>{t.copyUrl}</span>
                    {/if}
                </button>
            </div>
        </div>

        <div
            class="grid grid-cols-2 gap-3 rounded-lg border border-gray-100 bg-gray-50/70 p-3.5 text-xs"
        >
            <div>
                <span class="block text-gray-400">ID</span>
                <span class="block truncate font-mono font-medium text-gray-700">{item.id}</span>
            </div>
            <div>
                <span class="block text-gray-400">{t.uploadedAt}</span>
                <span class="font-medium text-gray-700">{formatDate(item.createdAt)}</span>
            </div>
        </div>
    </div>

    <div class="border-t border-gray-100"></div>

    <div class="flex items-center justify-end px-6 py-4">
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50"
        >
            {t.closeModal}
        </button>
    </div>
</div>
