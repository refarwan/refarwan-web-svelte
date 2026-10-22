<script lang="ts">
    import type { OperationalStatus } from "$lib/types/project";

    interface Props {
        status?: OperationalStatus | string;
        lang?: string;
        class?: string;
    }

    let { status = "live", lang = "en", class: className = "" }: Props = $props();

    const isEn = $derived(lang === "en" || lang === "en-US");
    const normalized = $derived((status || "live").toLowerCase());

    const label = $derived.by(() => {
        if (normalized === "in_development") {
            return isEn ? "In Dev" : "Pengembangan";
        }
        if (normalized === "discontinued") {
            return isEn ? "Discontinued" : "Ditutup";
        }
        return isEn ? "Live" : "Berjalan";
    });

    const badgeStyle = $derived.by(() => {
        if (normalized === "in_development") {
            return "border-amber-200/60 bg-amber-50 text-amber-700";
        }
        if (normalized === "discontinued") {
            return "border-gray-200 bg-gray-100 text-gray-600";
        }
        return "border-emerald-200/60 bg-emerald-50 text-emerald-700";
    });

    const dotStyle = $derived.by(() => {
        if (normalized === "in_development") return "bg-amber-500";
        if (normalized === "discontinued") return "bg-gray-400";
        return "bg-emerald-500 animate-pulse";
    });
</script>

<span
    class={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${badgeStyle} ${className}`}
>
    <span class={`h-1.5 w-1.5 rounded-full ${dotStyle}`}></span>
    <span>{label}</span>
</span>
