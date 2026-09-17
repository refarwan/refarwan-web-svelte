<script lang="ts">
    import { Toolbar } from "svelte-lexical";

    import HistoryButtons from "./HistoryButtons.svelte";
    import HomeGroup from "./HomeGroup.svelte";
    import InsertGroup from "./InsertGroup.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    let activeTab = $state<"home" | "insert">("home");
</script>

<div class="flex flex-col border-b border-gray-200 bg-gray-50">
    <div class="flex w-full items-end justify-between border-b border-gray-200 px-2 pt-1">
        <div class="flex items-end">
            <button
                type="button"
                onclick={() => (activeTab = "home")}
                class="relative h-9 cursor-pointer px-3 text-sm text-gray-700"
            >
                <span>{t.tabHome}</span>
                {#if activeTab === "home"}
                    <div
                        class="absolute -bottom-px left-0 h-0.75 w-full rounded-md bg-theme-500"
                    ></div>
                {/if}
            </button>
            <button
                type="button"
                onclick={() => (activeTab = "insert")}
                class="relative h-9 cursor-pointer px-3 text-sm text-gray-700"
            >
                <span>{t.tabInsert}</span>
                {#if activeTab === "insert"}
                    <div
                        class="absolute -bottom-px left-0 h-0.75 w-full rounded-md bg-theme-500"
                    ></div>
                {/if}
            </button>
        </div>
        <div class="flex h-9 items-center">
            <HistoryButtons {t} />
        </div>
    </div>

    <Toolbar>
        <div class="flex min-h-16 w-full flex-wrap items-center gap-x-1 gap-y-3 px-2 py-3">
            {#if activeTab === "home"}
                <HomeGroup {t} />
            {:else}
                <InsertGroup {t} />
            {/if}
        </div>
    </Toolbar>
</div>
