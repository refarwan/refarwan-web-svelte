<script lang="ts">
    import { CheckIcon, CopyIcon } from "lucide-svelte/icons";
    interface Props {
        t: Record<string, string>;
        embedUrl: string;
    }

    let { t, embedUrl }: Props = $props();

    const embedCode = $derived(
        `<iframe src="${embedUrl}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
    );

    let copiedField = $state<"url" | "code" | null>(null);

    const copy = async (field: "url" | "code", value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            copiedField = field;
            setTimeout(() => {
                if (copiedField === field) copiedField = null;
            }, 2000);
        } catch {
            // clipboard access denied; nothing to recover from here
        }
    };
</script>

<div class="space-y-2">
    <p class="text-[13px] font-medium text-gray-700">{t.embedLabel}</p>

    <div class="space-y-1">
        <span class="text-[11px] text-gray-500">{t.embedUrlLabel}</span>
        <div class="flex items-center gap-2">
            <input
                type="text"
                readonly
                value={embedUrl}
                class="h-9 w-full flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 font-mono text-xs text-gray-600"
            />
            <button
                type="button"
                onclick={() => copy("url", embedUrl)}
                class="flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
                {#if copiedField === "url"}
                    <CheckIcon class="h-3.5 w-3.5 text-emerald-600" />
                    {t.copiedLabel}
                {:else}
                    <CopyIcon class="h-3.5 w-3.5" />
                    {t.copyLabel}
                {/if}
            </button>
        </div>
    </div>

    <div class="space-y-1">
        <span class="text-[11px] text-gray-500">{t.embedCodeLabel}</span>
        <div class="flex items-center gap-2">
            <input
                type="text"
                readonly
                value={embedCode}
                class="h-9 w-full flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 font-mono text-xs text-gray-600"
            />
            <button
                type="button"
                onclick={() => copy("code", embedCode)}
                class="flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
                {#if copiedField === "code"}
                    <CheckIcon class="h-3.5 w-3.5 text-emerald-600" />
                    {t.copiedLabel}
                {:else}
                    <CopyIcon class="h-3.5 w-3.5" />
                    {t.copyLabel}
                {/if}
            </button>
        </div>
    </div>
</div>
