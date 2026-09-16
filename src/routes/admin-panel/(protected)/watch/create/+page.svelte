<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import FormActionButtons from './_components/FormActionButtons.svelte';
	import LanguageTabs from '$lib/components/admin/LanguageTabs.svelte';
	import ThumbnailCard from './_components/ThumbnailCard.svelte';
	import UploadProgressCard from './_components/UploadProgressCard.svelte';
	import VideoDetailsCard from './_components/VideoDetailsCard.svelte';
	import VideoMetaCard from './_components/VideoMetaCard.svelte';
	import VideoUploadCard from './_components/VideoUploadCard.svelte';
	import { popup } from '$lib/stores/popup.svelte';
	import { buildVideoFormData } from '$lib/utils/build-video-form-data';
	import { uploadWithProgress } from '$lib/utils/upload-with-progress';

	let { data } = $props();
	const t = $derived(data.t);

	const categoryOptions = $derived(
		data.categories.map((category) => ({ value: category.id, label: category.name }))
	);
	const statusOptions = $derived([
		{ value: 'draft', label: t.statusDraft },
		{ value: 'published', label: t.statusPublished }
	]);

	let videoFile: File | null = $state(null);
	let videoPreviewUrl = $state('');
	let videoDuration = $state(0);
	let videoEl: HTMLVideoElement | undefined = $state();
	let videoUploadCard: { resetInput: () => void } | undefined = $state();

	let thumbnailMode = $state<'video' | 'upload'>('video');
	let thumbnailFile: File | null = $state(null);
	let thumbnailPreviewUrl = $state('');
	let thumbnailPosition = $state(0);

	let activeLangCode = $state('en');
	let titles = $state<Record<string, string>>({});
	let descriptions = $state<Record<string, string>>({});
	let categoryId = $state('');
	let status = $state('published');

	let submitting = $state(false);
	let uploadPhase = $state<'idle' | 'uploading' | 'processing'>('idle');
	let uploadProgress = $state(0);
	let xhr: XMLHttpRequest | undefined;

	const activeLang = $derived(
		data.contentLanguages.find((lang) => lang.code === activeLangCode) ?? data.contentLanguages[0]
	);

	const handleVideoFile = (file: File | undefined) => {
		if (!file) return;
		if (!file.type.startsWith('video/')) {
			popup.error({ message: t.invalidVideoType });
			return;
		}
		videoFile = file;
		videoPreviewUrl = URL.createObjectURL(file);
		if (!titles.en) {
			titles = { ...titles, en: file.name.replace(/\.[^/.]+$/, '') };
		}
	};

	const removeVideo = () => {
		videoFile = null;
		videoPreviewUrl = '';
		videoDuration = 0;
		thumbnailPosition = 0;
		videoUploadCard?.resetInput();
	};

	const onThumbnailFileSelect = (file: File) => {
		thumbnailFile = file;
		thumbnailPreviewUrl = URL.createObjectURL(file);
	};

	const onScrub = (value: number) => {
		thumbnailPosition = value;
		if (videoEl) videoEl.currentTime = value;
	};

	const primaryTitle = $derived(titles.en?.trim() ?? '');
	const primaryDescription = $derived(descriptions.en?.trim() ?? '');

	const resetUploadState = () => {
		submitting = false;
		uploadPhase = 'idle';
		uploadProgress = 0;
		xhr = undefined;
	};

	const submit = () => {
		if (!videoFile) {
			popup.error({ message: t.videoRequired });
			return;
		}
		if (!primaryTitle) {
			popup.error({ message: t.titleRequired });
			return;
		}

		submitting = true;
		uploadPhase = 'uploading';
		uploadProgress = 0;

		const formData = buildVideoFormData({
			videoFile,
			primaryTitle,
			primaryDescription,
			categoryId,
			status,
			contentLanguages: data.contentLanguages,
			titles,
			descriptions,
			thumbnailMode,
			thumbnailFile,
			thumbnailPosition
		});

		xhr = uploadWithProgress(resolve('/admin-panel/api/video'), formData, {
			onProgress: (percent) => (uploadProgress = percent),
			onProcessing: () => (uploadPhase = 'processing'),
			onSuccess: () => {
				popup.success({ message: t.created });
				void goto(resolve('/admin-panel/watch/video'));
			},
			onError: (message) => {
				popup.error({ message });
				resetUploadState();
			}
		});
	};

	const cancelUpload = () => {
		xhr?.abort();
		resetUploadState();
	};
</script>

<svelte:head>
	<title>{t.createPageTitle}</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-4">
	<LanguageTabs
		languages={data.contentLanguages}
		activeCode={activeLangCode}
		onSelect={(code) => (activeLangCode = code)}
	/>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<div class="flex flex-col gap-4 lg:col-span-2">
			<VideoUploadCard
				bind:this={videoUploadCard}
				{t}
				{videoFile}
				{videoPreviewUrl}
				onFileSelect={handleVideoFile}
				onRemove={removeVideo}
				onLoadedMetadata={(duration) => (videoDuration = duration)}
				bind:videoEl
			/>

			<VideoDetailsCard
				{t}
				{activeLang}
				title={titles[activeLangCode] ?? ''}
				description={descriptions[activeLangCode] ?? ''}
				onTitleInput={(value) => (titles = { ...titles, [activeLangCode]: value })}
				onDescriptionInput={(value) =>
					(descriptions = { ...descriptions, [activeLangCode]: value })}
			/>
		</div>

		<div class="flex flex-col gap-4">
			<ThumbnailCard
				{t}
				mode={thumbnailMode}
				onModeChange={(mode) => (thumbnailMode = mode)}
				{videoFile}
				{videoDuration}
				position={thumbnailPosition}
				{onScrub}
				previewUrl={thumbnailPreviewUrl}
				onFileSelect={onThumbnailFileSelect}
			/>

			<VideoMetaCard
				{t}
				{categoryId}
				{categoryOptions}
				onCategoryChange={(value) => (categoryId = value)}
				{status}
				{statusOptions}
				onStatusChange={(value) => (status = value)}
			/>

			{#if uploadPhase !== 'idle'}
				<UploadProgressCard {t} phase={uploadPhase} progress={uploadProgress} />
			{/if}

			<FormActionButtons
				{t}
				cancelHref={resolve('/admin-panel/watch/video')}
				{submitting}
				onCancelUpload={cancelUpload}
				onSubmit={submit}
			/>
		</div>
	</div>
</div>
