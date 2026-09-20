<script lang="ts">
    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();
</script>

<div
    class="hidden grid-cols-[68px_1fr_200px_120px_110px] items-center gap-4 rounded-t-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase lg:grid"
>
    <div></div>
    <div>{t.tableTitle}</div>
    <div>{t.tableCategory}</div>
    <div>{t.tableStatus}</div>
    <div class="text-right">{t.tableAction}</div>
</div>
