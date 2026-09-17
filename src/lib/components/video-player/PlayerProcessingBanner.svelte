<script lang="ts">
    import { LoaderCircleIcon } from "lucide-svelte/icons";
</script>

<div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black text-white">
    <LoaderCircleIcon class="h-8 w-8 animate-spin" />
    <p class="text-sm text-gray-300">Processing…</p>
</div>
