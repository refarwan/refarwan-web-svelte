<script lang="ts">
	import Loader2 from 'lucide-svelte/icons/loader-2';

	interface Props {
		t: Record<string, string>;
		cancelHref: string;
		status: string;
		submitting: boolean;
		uploadPhase: 'uploading' | 'processing';
		uploadProgress: number;
		onSubmit: () => void;
	}

	let { t, cancelHref, status, submitting, uploadPhase, uploadProgress, onSubmit }: Props =
		$props();

	const submitLabel = $derived(
		status === 'draft' ? t.submitDraft : status === 'archived' ? t.submitArchived : t.submitPublish
	);
</script>

<div class="flex items-center justify-end gap-3 pt-2">
	<a
		href={cancelHref}
		class={`rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 ${
			submitting ? 'pointer-events-none opacity-50' : ''
		}`}
	>
		{t.cancel}
	</a>

	<button
		type="button"
		disabled={submitting}
		onclick={onSubmit}
		class="cursor-pointer rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-theme-700 disabled:opacity-50"
	>
		{#if submitting}
			<span class="flex items-center gap-2">
				<Loader2 class="size-4 animate-spin text-white" />
				<span>
					{uploadPhase === 'processing'
						? t.processingButtonLabel
						: `${t.uploadingLabel} ${uploadProgress}%`}
				</span>
			</span>
		{:else}
			{submitLabel}
		{/if}
	</button>
</div>
