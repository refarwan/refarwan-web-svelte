<script lang="ts">
	interface Props {
		t: Record<string, string>;
		cancelHref: string;
		submitting: boolean;
		onCancelUpload: () => void;
		onSubmit: () => void;
	}

	let { t, cancelHref, submitting, onCancelUpload, onSubmit }: Props = $props();
</script>

<div class="flex gap-2">
	<a
		href={cancelHref}
		class="flex-1 rounded-md border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-600 hover:bg-gray-50"
	>
		{t.cancel}
	</a>
	{#if submitting}
		<button
			type="button"
			onclick={onCancelUpload}
			class="flex-1 rounded-md border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
		>
			{t.cancel}
		</button>
	{:else}
		<button
			type="button"
			onclick={onSubmit}
			class="flex-1 rounded-md bg-theme-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-theme-700"
		>
			{t.submit}
		</button>
	{/if}
</div>
