<script lang="ts">
	import CloudUpload from 'lucide-svelte/icons/cloud-upload';

	interface Props {
		t: Record<string, string>;
		mode: 'video' | 'upload';
		onModeChange: (mode: 'video' | 'upload') => void;
		videoFile: File | null;
		videoDuration: number;
		position: number;
		onScrub: (value: number) => void;
		previewUrl: string;
		onFileSelect: (file: File) => void;
	}

	let {
		t,
		mode,
		onModeChange,
		videoFile,
		videoDuration,
		position,
		onScrub,
		previewUrl,
		onFileSelect
	}: Props = $props();

	let thumbnailInput: HTMLInputElement | undefined = $state();

	const onInputChange = (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file || !file.type.startsWith('image/')) return;
		onFileSelect(file);
	};
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
	<h2 class="text-base font-semibold text-gray-900">{t.thumbnailLabel}</h2>
	<hr class="my-4 border-gray-200" />

	<div class="flex gap-1.5">
		<button
			type="button"
			onclick={() => onModeChange('video')}
			class={`flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
				mode === 'video'
					? 'border-theme-600 bg-theme-50 text-theme-700'
					: 'border-gray-200 text-gray-500 hover:bg-gray-50'
			}`}
		>
			{t.thumbnailModeVideo}
		</button>
		<button
			type="button"
			onclick={() => onModeChange('upload')}
			class={`flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
				mode === 'upload'
					? 'border-theme-600 bg-theme-50 text-theme-700'
					: 'border-gray-200 text-gray-500 hover:bg-gray-50'
			}`}
		>
			{t.thumbnailModeUpload}
		</button>
	</div>

	<div class="mt-3">
		{#if mode === 'video'}
			{#if videoFile}
				<p class="mb-2 text-[11px] text-gray-500">{t.thumbnailPositionLabel}</p>
				<input
					type="range"
					min="0"
					max={videoDuration || 0}
					step="0.1"
					value={position}
					oninput={(event) => onScrub(Number((event.target as HTMLInputElement).value))}
					class="w-full accent-theme-600"
				/>
			{:else}
				<p class="text-xs text-gray-400">{t.videoFileLabel}</p>
			{/if}
		{:else}
			<button
				type="button"
				onclick={() => thumbnailInput?.click()}
				class="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 text-center hover:border-theme-400"
			>
				{#if previewUrl}
					<img src={previewUrl} alt="Thumbnail" class="h-24 w-full rounded-md object-cover" />
				{:else}
					<CloudUpload class="h-6 w-6 text-gray-400" />
					<span class="text-xs text-gray-500">{t.thumbnailUploadHint}</span>
				{/if}
			</button>
			<input
				bind:this={thumbnailInput}
				onchange={onInputChange}
				type="file"
				accept="image/jpeg,image/png"
				class="hidden"
			/>
		{/if}
	</div>
</section>
