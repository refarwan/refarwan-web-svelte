<script lang="ts">
	import X from 'lucide-svelte/icons/x';

	import DropdownSelect from '$lib/components/admin/DropdownSelect.svelte';

	import ThumbnailSelector from './ThumbnailSelector.svelte';

	interface Props {
		t: Record<string, string>;
		thumbnailMode: 'upload' | 'video';
		onThumbnailModeChange: (mode: 'upload' | 'video') => void;
		thumbnailPreviewUrl: string;
		onThumbnailSelect: (file: File | undefined) => void;
		onThumbnailClear: () => void;
		videoPreviewUrl: string;
		videoDuration: number;
		videoCurrentTime: number;
		onVideoTimeChange: (time: number) => void;
		onVideoLoadedMetadata: (duration: number) => void;
		status: string;
		onStatusChange: (value: string) => void;
		tags: string[];
		tagInput: string;
		onTagInputChange: (value: string) => void;
		onAddTag: (event: KeyboardEvent) => void;
		onRemoveTag: (tag: string) => void;
	}

	let {
		t,
		thumbnailMode,
		onThumbnailModeChange,
		thumbnailPreviewUrl,
		onThumbnailSelect,
		onThumbnailClear,
		videoPreviewUrl,
		videoDuration,
		videoCurrentTime,
		onVideoTimeChange,
		onVideoLoadedMetadata,
		status,
		onStatusChange,
		tags,
		tagInput,
		onTagInputChange,
		onAddTag,
		onRemoveTag
	}: Props = $props();

	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' },
		{ value: 'archived', label: 'Archived' }
	];
</script>

<div class="w-full space-y-5 lg:w-75 lg:shrink-0">
	<ThumbnailSelector
		{t}
		mode={thumbnailMode}
		onModeChange={onThumbnailModeChange}
		{thumbnailPreviewUrl}
		{onThumbnailSelect}
		{onThumbnailClear}
		{videoPreviewUrl}
		{videoDuration}
		{videoCurrentTime}
		{onVideoTimeChange}
		{onVideoLoadedMetadata}
	/>

	<DropdownSelect
		label={t.statusLabel}
		value={status}
		options={statusOptions}
		onChange={onStatusChange}
		placeholder={t.statusPlaceholder}
	/>

	<div class="space-y-1.5">
		<label class="block text-sm font-medium text-gray-700" for="video-tags-input"
			>{t.tagsLabel}</label
		>
		<div
			class="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-2xs focus-within:border-theme-500 focus-within:ring-1 focus-within:ring-theme-500"
		>
			{#each tags as tag (tag)}
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-theme-100 bg-theme-50 px-2.5 py-1 text-xs font-medium text-theme-600"
				>
					<span>{tag}</span>
					<button
						type="button"
						onclick={() => onRemoveTag(tag)}
						class="cursor-pointer rounded-full text-theme-400 transition-colors hover:text-theme-700"
					>
						<X class="h-3 w-3" />
					</button>
				</span>
			{/each}
			<input
				id="video-tags-input"
				type="text"
				value={tagInput}
				oninput={(event) => onTagInputChange((event.target as HTMLInputElement).value)}
				onkeydown={onAddTag}
				placeholder={tags.length === 0 ? t.tagInputPlaceholderEmpty : t.tagInputPlaceholderFilled}
				class="min-w-24 flex-1 border-none bg-transparent px-1 py-0.5 text-xs text-gray-800 placeholder-gray-400 outline-none"
			/>
		</div>
	</div>
</div>
