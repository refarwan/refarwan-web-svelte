<script lang="ts">
	import CloudUpload from 'lucide-svelte/icons/cloud-upload';
	import Video from 'lucide-svelte/icons/video';

	interface Props {
		t: Record<string, string>;
		videoFile: File | null;
		videoPreviewUrl: string;
		onFileSelect: (file: File | undefined) => void;
		onRemove: () => void;
		onLoadedMetadata: (duration: number) => void;
		videoEl?: HTMLVideoElement;
	}

	let {
		t,
		videoFile,
		videoPreviewUrl,
		onFileSelect,
		onRemove,
		onLoadedMetadata,
		videoEl = $bindable()
	}: Props = $props();

	let videoInput: HTMLInputElement | undefined = $state();
	let dragOver = $state(false);

	const onInputChange = (event: Event) => {
		onFileSelect((event.target as HTMLInputElement).files?.[0]);
	};

	const onDrop = (event: DragEvent) => {
		event.preventDefault();
		dragOver = false;
		onFileSelect(event.dataTransfer?.files?.[0]);
	};

	export const resetInput = (): void => {
		if (videoInput) videoInput.value = '';
	};
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
	<h2 class="text-base font-semibold text-gray-900">{t.videoFileLabel}</h2>
	<hr class="my-4 border-gray-200" />

	{#if !videoFile}
		<button
			type="button"
			onclick={() => videoInput?.click()}
			ondragover={(event) => {
				event.preventDefault();
				dragOver = true;
			}}
			ondragleave={() => (dragOver = false)}
			ondrop={onDrop}
			class={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-12 text-center transition-colors ${
				dragOver ? 'border-theme-500 bg-theme-50' : 'border-gray-300 hover:border-theme-400'
			}`}
		>
			<CloudUpload class="h-8 w-8 text-gray-400" />
			<span class="text-sm font-medium text-gray-700">{t.videoDropzoneHint}</span>
			<span class="text-xs text-gray-400">{t.videoDropzoneSubHint}</span>
		</button>
		<input
			bind:this={videoInput}
			onchange={onInputChange}
			type="file"
			accept="video/mp4,video/webm,video/quicktime"
			class="hidden"
		/>
	{:else}
		<div class="flex flex-col gap-3">
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				bind:this={videoEl}
				onloadedmetadata={() => onLoadedMetadata(videoEl?.duration ?? 0)}
				src={videoPreviewUrl}
				controls
				class="aspect-video w-full rounded-lg bg-black"
			></video>
			<div
				class="flex items-center justify-between rounded-lg border border-gray-200 px-3.5 py-2.5"
			>
				<span class="flex items-center gap-2 text-sm text-gray-700">
					<Video class="h-4 w-4 text-gray-400" />
					{videoFile.name}
				</span>
				<button
					type="button"
					onclick={onRemove}
					class="cursor-pointer text-xs font-medium text-red-600 hover:underline"
				>
					{t.removeFile}
				</button>
			</div>
		</div>
	{/if}
</section>
