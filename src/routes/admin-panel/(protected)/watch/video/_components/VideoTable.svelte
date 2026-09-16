<script lang="ts">
	import Archive from 'lucide-svelte/icons/archive';
	import ArchiveRestore from 'lucide-svelte/icons/archive-restore';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import type { VideoItem } from '$lib/types';

	interface Props {
		t: Record<string, string>;
		items: VideoItem[];
		search: string;
		onArchive: (item: VideoItem) => void;
		onUnarchive: (item: VideoItem) => void;
		onDelete: (item: VideoItem) => void;
	}

	let { t, items, search, onArchive, onUnarchive, onDelete }: Props = $props();

	const statusBadgeClass = (status: VideoItem['status']): string => {
		if (status === 'published') return 'bg-emerald-50 text-emerald-700';
		if (status === 'archived') return 'bg-gray-100 text-gray-600';
		return 'bg-amber-50 text-amber-700';
	};

	const statusLabel = (status: VideoItem['status']): string => {
		if (status === 'published') return t.statusPublished;
		if (status === 'archived') return t.statusArchived;
		return t.statusDraft;
	};

	const formatDate = (iso: string): string =>
		new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
</script>

<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
	<div
		class="hidden grid-cols-[72px_1fr_160px_120px_90px_110px_110px] items-center gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold text-gray-500 uppercase md:grid"
	>
		<span></span>
		<span>{t.tableTitle}</span>
		<span>{t.tableCategory}</span>
		<span>{t.tableStatus}</span>
		<span>{t.tableViews}</span>
		<span>{t.tableDate}</span>
		<span class="text-right">{t.tableAction}</span>
	</div>

	{#if items.length === 0}
		<div class="px-5 py-12 text-center text-sm text-gray-500">
			{search ? t.emptySearch : t.empty}
		</div>
	{:else}
		<div class="divide-y divide-gray-100">
			{#each items as item (item.id)}
				<div
					class="flex flex-col gap-3 px-5 py-3.5 md:grid md:grid-cols-[72px_1fr_160px_120px_90px_110px_110px] md:items-center md:gap-4"
				>
					<div
						class="h-11 w-18 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-100"
					>
						{#if item.thumbnail}
							<img
								src={item.thumbnail.small}
								alt={item.title ?? ''}
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>
					<span class="line-clamp-1 text-sm font-medium text-gray-800">
						{item.title ?? '—'}
					</span>
					<span class="text-xs text-gray-500 md:text-sm">
						{item.category ?? t.noCategory}
					</span>
					<span>
						<span
							class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(item.status)}`}
						>
							{statusLabel(item.status)}
						</span>
					</span>
					<span class="text-xs text-gray-500 md:text-sm">
						{item.viewsCount}
						{t.viewsSuffix}
					</span>
					<span class="text-xs text-gray-500 md:text-sm">{formatDate(item.createdAt)}</span>
					<div class="flex items-center gap-2 md:justify-end">
						{#if item.status === 'archived'}
							<button
								type="button"
								onclick={() => onUnarchive(item)}
								aria-label={t.unarchive}
								title={t.unarchive}
								class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-theme-600"
							>
								<ArchiveRestore class="h-4 w-4" />
							</button>
						{:else}
							<button
								type="button"
								onclick={() => onArchive(item)}
								aria-label={t.archive}
								title={t.archive}
								class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-theme-600"
							>
								<Archive class="h-4 w-4" />
							</button>
						{/if}
						<button
							type="button"
							onclick={() => onDelete(item)}
							aria-label={t.delete}
							title={t.delete}
							class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
