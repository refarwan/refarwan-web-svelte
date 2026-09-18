<script lang="ts">
    interface Props {
        status?: string;
        lang?: string;
        class?: string;
    }

    let { status = "draft", lang = "en", class: className = "" }: Props = $props();

    const isEn = $derived(lang === "en" || lang === "en-US");
    const normalized = $derived((status || "draft").toLowerCase());
</script>

{#if normalized === "published"}
    <span
        class={`inline-flex h-max items-center rounded-md border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ${className}`}
    >
        {isEn ? "Published" : "Dipublikasikan"}
    </span>
{:else}
    <span
        class={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
            normalized === "archived"
                ? "border border-amber-200/60 bg-amber-50 text-amber-700"
                : "border border-gray-200 bg-gray-100 text-gray-700"
        } ${className}`}
    >
        {normalized === "archived" ? (isEn ? "Archived" : "Diarsipkan") : isEn ? "Draft" : "Draf"}
    </span>
{/if}
