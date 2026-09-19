<script lang="ts">
    interface Props {
        category?: string | null;
        fallback?: string;
        class?: string;
    }

    let { category, fallback = "-", class: className = "" }: Props = $props();

    const text = $derived(category || fallback);
</script>

<div
    class={`h-max w-max rounded-full bg-theme-50 px-2.5 py-1 text-[12px] font-medium text-theme-700 ${className}`}
>
    {text}
</div>
