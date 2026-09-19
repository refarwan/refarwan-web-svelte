<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        embedUrl: string;
        iframeCode: string;
        isEn?: boolean;
    }

    let { embedUrl, iframeCode, isEn = true }: Props = $props();

    let copiedEmbed = $state(false);
    let copiedIframe = $state(false);

    const copyEmbed = async () => {
        if (!embedUrl) return;
        await navigator.clipboard.writeText(embedUrl);
        copiedEmbed = true;
        setTimeout(() => (copiedEmbed = false), 2000);
    };

    const copyIframe = async () => {
        if (!iframeCode) return;
        await navigator.clipboard.writeText(iframeCode);
        copiedIframe = true;
        setTimeout(() => (copiedIframe = false), 2000);
    };
</script>

<div class="w-full space-y-3">
    <!-- Embed URL -->
    <div class="flex w-full shrink-0 flex-col items-start gap-1.5">
        <p class="text-[12px] font-medium text-gray-700">
            {isEn ? "Embed URL" : "URL Embed"}
        </p>
        <div class="flex w-full items-stretch overflow-hidden rounded-lg border border-gray-300">
            <div
                class="flex h-8.75 min-w-0 flex-1 items-center overflow-x-auto bg-gray-50 px-3 py-2"
            >
                <p class="font-mono text-[11px] whitespace-nowrap text-gray-500 select-all">
                    {embedUrl}
                </p>
            </div>
            <button
                type="button"
                onclick={copyEmbed}
                class="flex shrink-0 cursor-pointer items-center justify-center gap-1 bg-theme-600 px-3 py-2 text-white transition-colors hover:bg-theme-700"
            >
                {#if copiedEmbed}
                    <Icon icon="lucide:check" class="size-3.5" />
                    <p class="text-[11px] font-medium whitespace-nowrap">
                        {isEn ? "Copied" : "Tersalin"}
                    </p>
                {:else}
                    <Icon icon="lucide:copy" class="size-3.5" />
                    <p class="text-[11px] font-medium whitespace-nowrap">
                        {isEn ? "Copy" : "Salin"}
                    </p>
                {/if}
            </button>
        </div>
    </div>

    <!-- Iframe URL -->
    <div class="flex w-full shrink-0 flex-col items-start gap-1.5">
        <p class="text-[12px] font-medium text-gray-700">
            {isEn ? "Iframe URL" : "URL Iframe"}
        </p>
        <div class="flex w-full items-stretch overflow-hidden rounded-lg border border-gray-300">
            <div
                class="flex h-8.75 min-w-0 flex-1 items-center overflow-x-auto bg-gray-50 px-3 py-2"
            >
                <p class="font-mono text-[11px] whitespace-nowrap text-gray-500 select-all">
                    {iframeCode}
                </p>
            </div>
            <button
                type="button"
                onclick={copyIframe}
                class="flex shrink-0 cursor-pointer items-center justify-center gap-1 bg-theme-600 px-3 py-2 text-white transition-colors hover:bg-theme-700"
            >
                {#if copiedIframe}
                    <Icon icon="lucide:check" class="size-3.5" />
                    <p class="text-[11px] font-medium whitespace-nowrap">
                        {isEn ? "Copied" : "Tersalin"}
                    </p>
                {:else}
                    <Icon icon="lucide:copy" class="size-3.5" />
                    <p class="text-[11px] font-medium whitespace-nowrap">
                        {isEn ? "Copy" : "Salin"}
                    </p>
                {/if}
            </button>
        </div>
    </div>
</div>
