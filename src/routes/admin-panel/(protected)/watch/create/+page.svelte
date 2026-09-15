<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import CloudUpload from 'lucide-svelte/icons/cloud-upload';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import Video from 'lucide-svelte/icons/video';

	import DropdownSelect from '$lib/components/admin/DropdownSelect.svelte';
	import { popup } from '$lib/stores/popup.svelte';

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
	let videoInput: HTMLInputElement | undefined = $state();
	let videoEl: HTMLVideoElement | undefined = $state();
	let dragOver = $state(false);

	let thumbnailMode = $state<'video' | 'upload'>('video');
	let thumbnailFile: File | null = $state(null);
	let thumbnailPreviewUrl = $state('');
	let thumbnailInput: HTMLInputElement | undefined = $state();
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

	const onVideoInputChange = (event: Event) => {
		handleVideoFile((event.target as HTMLInputElement).files?.[0]);
	};

	const onVideoDrop = (event: DragEvent) => {
		event.preventDefault();
		dragOver = false;
		handleVideoFile(event.dataTransfer?.files?.[0]);
	};

	const removeVideo = () => {
		videoFile = null;
		videoPreviewUrl = '';
		videoDuration = 0;
		thumbnailPosition = 0;
		if (videoInput) videoInput.value = '';
	};

	const onVideoLoadedMetadata = () => {
		videoDuration = videoEl?.duration ?? 0;
	};

	const onThumbnailInputChange = (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) return;
		thumbnailFile = file;
		thumbnailPreviewUrl = URL.createObjectURL(file);
	};

	const onScrub = (event: Event) => {
		thumbnailPosition = Number((event.target as HTMLInputElement).value);
		if (videoEl) videoEl.currentTime = thumbnailPosition;
	};

	const onTitleInput = (event: Event) => {
		titles = { ...titles, [activeLangCode]: (event.target as HTMLInputElement).value };
	};

	const onDescriptionInput = (event: Event) => {
		descriptions = {
			...descriptions,
			[activeLangCode]: (event.target as HTMLTextAreaElement).value
		};
	};

	const primaryTitle = $derived(titles.en?.trim() ?? '');
	const primaryDescription = $derived(descriptions.en?.trim() ?? '');

	const translationsPayload = $derived(
		data.contentLanguages
			.filter((lang) => lang.code !== 'en' && titles[lang.code]?.trim())
			.map((lang) => ({
				languageCode: lang.locale,
				title: titles[lang.code].trim(),
				description: descriptions[lang.code]?.trim() || titles[lang.code].trim()
			}))
	);

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

		const formData = new FormData();
		formData.set('video', videoFile);
		formData.set('title', primaryTitle);
		if (primaryDescription) formData.set('description', primaryDescription);
		if (categoryId) formData.set('categoryId', categoryId);
		formData.set('status', status);
		if (translationsPayload.length > 0) {
			formData.set('translations', JSON.stringify(translationsPayload));
		}
		if (thumbnailMode === 'upload' && thumbnailFile) {
			formData.set('thumbnail', thumbnailFile);
		} else if (thumbnailMode === 'video') {
			formData.set('thumbnailPosition', String(Math.round(thumbnailPosition)));
		}

		submitting = true;
		uploadPhase = 'uploading';
		uploadProgress = 0;

		const request = new XMLHttpRequest();
		xhr = request;

		request.upload.addEventListener('progress', (event) => {
			if (!event.lengthComputable) return;
			const percent = Math.round((event.loaded / event.total) * 100);
			uploadProgress = Math.min(99, percent);
			if (percent >= 100) uploadPhase = 'processing';
		});

		request.addEventListener('load', () => {
			if (request.status >= 200 && request.status < 300) {
				popup.success({ message: t.created });
				void goto(resolve('/admin-panel/watch/video'));
				return;
			}

			let message = 'Failed to upload video';
			try {
				const body = JSON.parse(request.responseText) as Record<string, unknown>;
				if (typeof body.message === 'string') message = body.message;
				else {
					const [first] = Object.values(body).filter(
						(value): value is string => typeof value === 'string'
					);
					if (first) message = first;
				}
			} catch {
				// keep fallback message
			}
			popup.error({ message });
			resetUploadState();
		});

		request.addEventListener('error', () => {
			popup.error({ message: 'Failed to upload video' });
			resetUploadState();
		});

		request.open('POST', resolve('/admin-panel/api/video'));
		request.send(formData);
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
	{#if data.contentLanguages.length > 1}
		<div class="flex flex-wrap gap-1.5">
			{#each data.contentLanguages as lang (lang.code)}
				<button
					type="button"
					onclick={() => (activeLangCode = lang.code)}
					class={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
						activeLangCode === lang.code
							? 'border-theme-600 bg-theme-50 text-theme-700'
							: 'border-gray-200 text-gray-500 hover:bg-gray-50'
					}`}
				>
					<span class="leading-none">{lang.flag}</span>
					<span>{lang.name}</span>
				</button>
			{/each}
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<div class="flex flex-col gap-4 lg:col-span-2">
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
						ondrop={onVideoDrop}
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
						onchange={onVideoInputChange}
						type="file"
						accept="video/mp4,video/webm,video/quicktime"
						class="hidden"
					/>
				{:else}
					<div class="flex flex-col gap-3">
						<!-- svelte-ignore a11y_media_has_caption -->
						<video
							bind:this={videoEl}
							onloadedmetadata={onVideoLoadedMetadata}
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
								onclick={removeVideo}
								class="cursor-pointer text-xs font-medium text-red-600 hover:underline"
							>
								{t.removeFile}
							</button>
						</div>
					</div>
				{/if}
			</section>

			<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
				<h2 class="text-base font-semibold text-gray-900">
					{t.titleLabel}
					{#if activeLang}
						<span class="font-normal text-gray-400">({activeLang.name})</span>
					{/if}
				</h2>
				<hr class="my-4 border-gray-200" />

				<div class="flex flex-col gap-4">
					<div>
						<input
							type="text"
							value={titles[activeLangCode] ?? ''}
							oninput={onTitleInput}
							placeholder={t.titlePlaceholder}
							class="h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
						/>
					</div>
					<div>
						<label class="block text-[13px] font-medium text-gray-700" for="video-description">
							{t.descriptionLabel}
						</label>
						<textarea
							id="video-description"
							value={descriptions[activeLangCode] ?? ''}
							oninput={onDescriptionInput}
							placeholder={t.descriptionPlaceholder}
							rows="4"
							class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
						></textarea>
					</div>
				</div>
			</section>
		</div>

		<div class="flex flex-col gap-4">
			<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
				<h2 class="text-base font-semibold text-gray-900">{t.thumbnailLabel}</h2>
				<hr class="my-4 border-gray-200" />

				<div class="flex gap-1.5">
					<button
						type="button"
						onclick={() => (thumbnailMode = 'video')}
						class={`flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
							thumbnailMode === 'video'
								? 'border-theme-600 bg-theme-50 text-theme-700'
								: 'border-gray-200 text-gray-500 hover:bg-gray-50'
						}`}
					>
						{t.thumbnailModeVideo}
					</button>
					<button
						type="button"
						onclick={() => (thumbnailMode = 'upload')}
						class={`flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
							thumbnailMode === 'upload'
								? 'border-theme-600 bg-theme-50 text-theme-700'
								: 'border-gray-200 text-gray-500 hover:bg-gray-50'
						}`}
					>
						{t.thumbnailModeUpload}
					</button>
				</div>

				<div class="mt-3">
					{#if thumbnailMode === 'video'}
						{#if videoFile}
							<p class="mb-2 text-[11px] text-gray-500">{t.thumbnailPositionLabel}</p>
							<input
								type="range"
								min="0"
								max={videoDuration || 0}
								step="0.1"
								value={thumbnailPosition}
								oninput={onScrub}
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
							{#if thumbnailPreviewUrl}
								<img
									src={thumbnailPreviewUrl}
									alt="Thumbnail"
									class="h-24 w-full rounded-md object-cover"
								/>
							{:else}
								<CloudUpload class="h-6 w-6 text-gray-400" />
								<span class="text-xs text-gray-500">{t.thumbnailUploadHint}</span>
							{/if}
						</button>
						<input
							bind:this={thumbnailInput}
							onchange={onThumbnailInputChange}
							type="file"
							accept="image/jpeg,image/png"
							class="hidden"
						/>
					{/if}
				</div>
			</section>

			<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
				<h2 class="text-base font-semibold text-gray-900">{t.categoryLabel}</h2>
				<hr class="my-4 border-gray-200" />
				<DropdownSelect
					value={categoryId}
					options={categoryOptions}
					onChange={(value) => (categoryId = value)}
					placeholder={t.categoryPlaceholder}
					searchable
				/>
			</section>

			<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
				<h2 class="text-base font-semibold text-gray-900">{t.statusLabel}</h2>
				<hr class="my-4 border-gray-200" />
				<DropdownSelect
					value={status}
					options={statusOptions}
					onChange={(value) => (status = value)}
				/>
			</section>

			{#if uploadPhase !== 'idle'}
				<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
					<div class="flex items-center justify-between text-xs text-gray-600">
						<span class="flex items-center gap-1.5">
							<Loader2 class="h-3.5 w-3.5 animate-spin" />
							{uploadPhase === 'uploading' ? t.uploadingLabel : t.processingLabel}
						</span>
						{#if uploadPhase === 'uploading'}
							<span>{uploadProgress}%</span>
						{/if}
					</div>
					<div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
						<div
							class="h-full rounded-full bg-theme-600 transition-all"
							style={`width: ${uploadPhase === 'processing' ? 100 : uploadProgress}%`}
						></div>
					</div>
				</section>
			{/if}

			<div class="flex gap-2">
				<a
					href={resolve('/admin-panel/watch/video')}
					class="flex-1 rounded-md border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-600 hover:bg-gray-50"
				>
					{t.cancel}
				</a>
				{#if submitting}
					<button
						type="button"
						onclick={cancelUpload}
						class="flex-1 rounded-md border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
					>
						{t.cancel}
					</button>
				{:else}
					<button
						type="button"
						onclick={submit}
						class="flex-1 rounded-md bg-theme-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-theme-700"
					>
						{t.submit}
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
