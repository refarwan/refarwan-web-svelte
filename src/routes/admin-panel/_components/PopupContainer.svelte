<script lang="ts">
    import { CircleCheckBigIcon, CircleQuestionMark, CircleXIcon } from "lucide-svelte/icons";

    import { popup } from "$lib/stores/popup.svelte";
</script>

{#each popup.items as item, index (item.id)}
    {#if item.type === "custom"}
        <div
            style={`z-index: ${50 + index}`}
            class="animate-popup-backdrop fixed inset-0 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
            {@render item.component()}
        </div>
    {:else}
        {@const isTopMost = index === popup.items.length - 1}
        <div
            style={`z-index: ${50 + index}`}
            class="animate-popup-backdrop fixed inset-0 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs select-none"
        >
            <div
                class="animate-popup-card relative flex w-full max-w-105 flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl md:px-7 md:py-6"
            >
                <!-- Header -->
                {#if item.type === "errorAlert"}
                    <div class="flex items-center gap-3">
                        <CircleXIcon class="animate-popup-icon h-8 w-8 shrink-0 text-red-600" />
                        <h3 class="text-lg font-bold text-gray-900">{item.title ?? "Error"}</h3>
                    </div>
                {:else if item.type === "confirm"}
                    <div class="flex items-center gap-3">
                        <CircleQuestionMark
                            class="animate-popup-icon h-8 w-8 shrink-0 text-sky-600"
                        />
                        <h3 class="text-lg font-bold text-gray-900">
                            {item.title ?? "Confirm Action"}
                        </h3>
                    </div>
                {:else if item.type === "successAlert"}
                    <div class="flex items-center gap-3">
                        <CircleCheckBigIcon
                            class="animate-popup-icon h-8 w-8 shrink-0 text-emerald-600"
                        />
                        <h3 class="text-lg font-bold text-gray-900">{item.title ?? "Success"}</h3>
                    </div>
                {:else}
                    <div class="flex items-center">
                        <h3 class="text-lg font-bold text-gray-900">{item.title ?? "Alert"}</h3>
                    </div>
                {/if}

                <hr class="border-gray-200" />

                <p class="text-left text-sm leading-relaxed whitespace-pre-line text-gray-600">
                    {item.message}
                </p>

                <div class="flex items-center justify-end gap-3 pt-1">
                    {#if item.type === "confirm"}
                        <button
                            type="button"
                            onclick={() => {
                                item.onCancel?.();
                                popup.remove(item.id);
                            }}
                            class="cursor-pointer rounded-lg border border-gray-200 bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-200 active:scale-95"
                        >
                            {item.cancelText ?? "Cancel"}
                        </button>
                        <button
                            type="button"
                            autofocus={isTopMost}
                            onclick={() => {
                                item.onConfirm?.();
                                popup.remove(item.id);
                            }}
                            class="cursor-pointer rounded-lg bg-theme-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-theme-700 active:scale-95"
                        >
                            {item.confirmText ?? "Confirm"}
                        </button>
                    {:else if item.type === "errorAlert"}
                        <button
                            type="button"
                            autofocus={isTopMost}
                            onclick={() => {
                                item.onConfirm?.();
                                popup.remove(item.id);
                            }}
                            class="cursor-pointer rounded-lg bg-theme-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-theme-700 active:scale-95"
                        >
                            {item.confirmText ?? "Close"}
                        </button>
                    {:else if item.type === "successAlert"}
                        <button
                            type="button"
                            autofocus={isTopMost}
                            onclick={() => {
                                item.onConfirm?.();
                                popup.remove(item.id);
                            }}
                            class="cursor-pointer rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
                        >
                            {item.confirmText ?? "OK"}
                        </button>
                    {:else}
                        <button
                            type="button"
                            autofocus={isTopMost}
                            onclick={() => {
                                item.onConfirm?.();
                                popup.remove(item.id);
                            }}
                            class="cursor-pointer rounded-lg bg-theme-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-theme-700 active:scale-95"
                        >
                            {item.confirmText ?? "OK"}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
{/each}
