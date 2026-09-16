<script lang="ts">
	import Pencil from 'lucide-svelte/icons/pencil';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import type { VideoCategoryItem } from '$lib/types';

	interface Props {
		t: Record<string, string>;
		items: VideoCategoryItem[];
		search: string;
		loadingEditId: string;
		onEdit: (item: VideoCategoryItem) => void;
		onDelete: (item: VideoCategoryItem) => void;
	}

	let { t, items, search, loadingEditId, onEdit, onDelete }: Props = $props();
</script>

<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
	<div
		class="hidden grid-cols-[1fr_240px_130px_90px] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold text-gray-500 uppercase md:grid"
	>
		<span>{t.tableName}</span>
		<span>{t.tableSlug}</span>
		<span>{t.tableVideos}</span>
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
					class="flex flex-col gap-2 px-5 py-3.5 md:grid md:grid-cols-[1fr_240px_130px_90px] md:items-center md:gap-4"
				>
					<span class="text-sm font-medium text-gray-800">{item.name}</span>
					<span class="text-xs text-gray-500 md:text-sm">{item.slug}</span>
					<span class="text-xs text-gray-500 md:text-sm">
						{item.videoCount}
						{t.videosSuffix}
					</span>
					<div class="flex items-center gap-2 md:justify-end">
						<button
							type="button"
							onclick={() => onEdit(item)}
							disabled={loadingEditId === item.id}
							aria-label={t.edit}
							title={t.edit}
							class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-theme-600 disabled:opacity-50"
						>
							<Pencil class="h-4 w-4" />
						</button>
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
