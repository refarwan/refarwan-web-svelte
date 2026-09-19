<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        embedValue: string;
        onInput: (val: string) => void;
        t: Record<string, string>;
    }

    let { embedValue, onInput, t }: Props = $props();

    const cleanSrc = $derived.by(() => {
        const val = embedValue.trim();
        if (val.startsWith("<iframe")) {
            const match = val.match(/src=["']([^"']+)["']/);
            return match ? match[1] : "";
        }
        return val;
    });
</script>

<div class="space-y-4 py-3">
    <div>
        <label for="video-embed-input" class="block text-xs font-medium text-gray-700">
            {t.embedUrlLabel}
        </label>
        <p class="mt-0.5 text-[11px] text-gray-500">
            {t.selectVideoSubtitle}
        </p>
        <div class="mt-2">
            <textarea
                id="video-embed-input"
                rows="3"
                value={embedValue}
                oninput={(e) => onInput((e.target as HTMLTextAreaElement).value)}
                placeholder={t.embedUrlPlaceholder}
                class="w-full rounded-lg border border-gray-300 p-2.5 font-mono text-xs text-gray-800 placeholder-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            ></textarea>
        </div>
    </div>

    {#if cleanSrc}
        <div class="space-y-1.5">
            <p class="text-[11px] font-medium text-gray-600">Preview:</p>
            <div class="aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                    src={cleanSrc}
                    title="Video Preview"
                    class="h-full w-full border-0"
                    frameborder="0"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
    {:else}
        <div
            class="flex h-36 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 text-gray-400"
        >
            <Icon icon="lucide:code-2" class="size-6 text-gray-300" />
            <p class="mt-1 text-xs">{t.embedUrlPlaceholder}</p>
        </div>
    {/if}
</div>
