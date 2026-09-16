<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import LanguageTabs from '$lib/components/admin/LanguageTabs.svelte';
	import UploadProgressModal from './_components/UploadProgressModal.svelte';
	import VideoMetadataForm from './_components/VideoMetadataForm.svelte';
	import VideoSideSettings from './_components/VideoSideSettings.svelte';
	import WatchCreateActions from './_components/WatchCreateActions.svelte';
	import { popup } from '$lib/stores/popup.svelte';
	import { buildVideoFormData } from '$lib/utils/build-video-form-data';
	import { uploadWithProgress } from '$lib/utils/upload-with-progress';
	import { useUnsavedChangesGuard } from '$lib/utils/unsaved-changes-guard.svelte';

	let { data } = $props();
	const t = $derived(data.t);

	const categoryOptions = $derived(
		data.categories.map((category) => ({ value: category.id, label: category.name }))
	);

	let activeLangCode = $state(data.contentLanguages[0]?.code ?? 'en');

	let videoFile: File | null = $state(null);
	let videoPreviewUrl = $state('');
	let videoDuration = $state(0);
	let videoCurrentTime = $state(0);
	let videoDropzoneRef: { resetInput: () => void } | undefined = $state();

	let thumbnailMode = $state<'upload' | 'video'>('video');
	let thumbnailFile: File | null = $state(null);
	let thumbnailPreviewUrl = $state('');

	let titles = $state<Record<string, string>>({});
	let descriptions = $state<Record<string, string>>({});
	let categoryId = $state('');
	let status = $state('published');
	let tags = $state<string[]>(['Tutorial', 'Review', 'Coding', 'Vlog']);
	let tagInput = $state('');

	let submitting = $state(false);
	let uploadPhase = $state<'uploading' | 'processing'>('uploading');
	let uploadProgress = $state(0);
	let uploadLoaded = $state(0);
	let uploadTotal = $state(0);
	let xhr: XMLHttpRequest | undefined;
	const uploadPopupId = 'video-upload-progress';

	useUnsavedChangesGuard(
		() => submitting,
		() => t.leaveWhileUploadingWarning
	);

	const handleVideoFile = (file: File | undefined) => {
		if (!file) return;
		if (!file.type.startsWith('video/')) {
			popup.error({ message: t.invalidVideoType });
			return;
		}
		if (file.size > 1024 * 1024 * 1024) {
			popup.error({ message: t.videoSizeExceeded });
			return;
		}
		videoFile = file;
		videoPreviewUrl = URL.createObjectURL(file);
		if (!titles[activeLangCode]?.trim()) {
			titles = { ...titles, [activeLangCode]: file.name.replace(/\.[^/.]+$/, '') };
		}
	};

	const clearVideo = () => {
		videoFile = null;
		videoPreviewUrl = '';
		videoDuration = 0;
		videoCurrentTime = 0;
		videoDropzoneRef?.resetInput();
	};

	const handleThumbnailFile = (file: File | undefined) => {
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			popup.error({ message: t.invalidThumbnailType });
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			popup.error({ message: t.thumbnailSizeExceeded });
			return;
		}
		thumbnailFile = file;
		thumbnailPreviewUrl = URL.createObjectURL(file);
	};

	const clearThumbnail = () => {
		thumbnailFile = null;
		thumbnailPreviewUrl = '';
	};

	const onAddTag = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' && event.key !== ',') return;
		event.preventDefault();
		const trimmed = tagInput.trim().replace(/^,+|,+$/g, '');
		if (trimmed && !tags.includes(trimmed)) {
			tags = [...tags, trimmed];
			tagInput = '';
		}
	};

	const removeTag = (tag: string) => {
		tags = tags.filter((existing) => existing !== tag);
	};

	const primaryTitle = $derived(
		titles.en?.trim() ||
			titles[activeLangCode]?.trim() ||
			Object.values(titles)
				.find((title) => title.trim())
				?.trim() ||
			''
	);
	const primaryDescription = $derived(
		descriptions.en?.trim() || descriptions[activeLangCode]?.trim() || ''
	);

	const resetUploadState = () => {
		submitting = false;
		uploadPhase = 'uploading';
		uploadProgress = 0;
		uploadLoaded = 0;
		uploadTotal = 0;
		xhr = undefined;
		popup.remove(uploadPopupId);
	};

	const submit = () => {
		if (!primaryTitle.trim()) {
			popup.error({ message: t.titleRequired });
			return;
		}
		if (!videoFile) {
			popup.error({ message: t.videoRequired });
			return;
		}

		submitting = true;
		uploadPhase = 'uploading';
		uploadProgress = 0;
		uploadLoaded = 0;
		uploadTotal = videoFile.size;

		popup.custom({ id: uploadPopupId, component: uploadProgressSnippet });

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
			thumbnailPosition: videoCurrentTime
		});

		xhr = uploadWithProgress(resolve('/admin-panel/api/video'), formData, {
			onProgress: (percent, loaded, total) => {
				uploadProgress = percent;
				uploadLoaded = loaded;
				uploadTotal = total;
			},
			onProcessing: () => (uploadPhase = 'processing'),
			onSuccess: () => {
				popup.remove(uploadPopupId);
				const message =
					status === 'draft'
						? t.createdDraft
						: status === 'archived'
							? t.createdArchived
							: t.createdPublished;
				popup.success({ message });
				void goto(resolve('/admin-panel/watch/video'));
			},
			onError: (message) => {
				popup.error({ message });
				resetUploadState();
			}
		});
	};

	const cancelUpload = () => {
		popup.confirm({
			title: t.cancelUploadConfirmTitle,
			message: t.cancelUploadConfirmMessage,
			confirmText: t.cancelUploadConfirmButton,
			cancelText: t.keepUploadingButton,
			onConfirm: () => {
				xhr?.abort();
				popup.error({ message: t.uploadCancelled });
				resetUploadState();
			}
		});
	};
</script>

<svelte:head>
	<title>{t.createPageTitle}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<h2 class="text-xl font-semibold text-gray-900">{t.createPageTitle}</h2>

		<LanguageTabs
			languages={data.contentLanguages}
			activeCode={activeLangCode}
			onSelect={(code) => (activeLangCode = code)}
		/>
	</div>

	<div class="flex flex-col items-start gap-6 lg:flex-row">
		<VideoMetadataForm
			{t}
			title={titles[activeLangCode] ?? ''}
			onTitleChange={(value) => (titles = { ...titles, [activeLangCode]: value })}
			{categoryId}
			onCategoryChange={(value) => (categoryId = value)}
			{categoryOptions}
			description={descriptions[activeLangCode] ?? ''}
			onDescriptionChange={(value) => (descriptions = { ...descriptions, [activeLangCode]: value })}
			{videoFile}
			onVideoSelect={handleVideoFile}
			onVideoClear={clearVideo}
			bind:videoDropzoneRef
		/>

		<VideoSideSettings
			{t}
			{thumbnailMode}
			onThumbnailModeChange={(mode) => (thumbnailMode = mode)}
			{thumbnailPreviewUrl}
			onThumbnailSelect={handleThumbnailFile}
			onThumbnailClear={clearThumbnail}
			{videoPreviewUrl}
			{videoDuration}
			{videoCurrentTime}
			onVideoTimeChange={(time) => (videoCurrentTime = time)}
			onVideoLoadedMetadata={(duration) => (videoDuration = duration)}
			{status}
			onStatusChange={(value) => (status = value)}
			{tags}
			{tagInput}
			onTagInputChange={(value) => (tagInput = value)}
			{onAddTag}
			onRemoveTag={removeTag}
		/>
	</div>

	<WatchCreateActions
		{t}
		cancelHref={resolve('/admin-panel/watch/video')}
		{status}
		{submitting}
		{uploadPhase}
		{uploadProgress}
		onSubmit={submit}
	/>
</div>

{#snippet uploadProgressSnippet()}
	<UploadProgressModal
		{t}
		{uploadPhase}
		{uploadProgress}
		{uploadLoaded}
		{uploadTotal}
		fileName={videoFile?.name ?? 'video.mp4'}
		onCancel={cancelUpload}
	/>
{/snippet}
