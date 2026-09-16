<script lang="ts">
	import Loader2 from 'lucide-svelte/icons/loader-2';

	interface Props {
		t: Record<string, string>;
		phase: 'uploading' | 'processing';
		progress: number;
	}

	let { t, phase, progress }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
	<div class="flex items-center justify-between text-xs text-gray-600">
		<span class="flex items-center gap-1.5">
			<Loader2 class="h-3.5 w-3.5 animate-spin" />
			{phase === 'uploading' ? t.uploadingLabel : t.processingLabel}
		</span>
		{#if phase === 'uploading'}
			<span>{progress}%</span>
		{/if}
	</div>
	<div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
		<div
			class="h-full rounded-full bg-theme-600 transition-all"
			style={`width: ${phase === 'processing' ? 100 : progress}%`}
		></div>
	</div>
</section>
