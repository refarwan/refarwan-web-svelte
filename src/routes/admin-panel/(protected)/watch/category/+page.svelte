<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	import Pencil from 'lucide-svelte/icons/pencil';
	import Search from 'lucide-svelte/icons/search';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	import VideoCategoryFormModal from '$lib/components/admin/VideoCategoryFormModal.svelte';
	import { popup } from '$lib/stores/popup.svelte';

	import type { VideoCategoryDetail, VideoCategoryItem } from '$lib/types';

	let { data, form } = $props();
	const t = $derived(data.t);
	const commonT = $derived(data.common);

	const basePath = resolve('/admin-panel/watch/category');

	let searchInput = $state(data.search);
	let searchDebounce: ReturnType<typeof setTimeout> | undefined;

	const buildHref = (page: number, search: string): string => {
		const params = new SvelteURLSearchParams();
		if (search) params.set('search', search);
		if (page > 1) params.set('page', String(page));
		const qs = params.toString();
		return qs ? `${basePath}?${qs}` : basePath;
	};

	const onSearchInput = () => {
		clearTimeout(searchDebounce);
		searchDebounce = setTimeout(() => {
			void goto(buildHref(1, searchInput), { keepFocus: true, noScroll: true });
		}, 350);
	};

	$effect(() => {
		// popup.success/error read and write the popup store's own state, so calling
		// them untracked keeps this effect's only dependency on `form` — otherwise it
		// re-triggers itself via the store write and floods duplicate popups.
		if (form?.success && form.message) {
			untrack(() => popup.success({ message: form.message ?? '' }));
		} else if (form?.error) {
			untrack(() => popup.error({ message: form.error ?? '' }));
		}
	});

	// --- Add / Edit modal ---
	let modalPopupId = $state('');
	let modalMode = $state<'create' | 'edit'>('create');
	let editingCategory = $state<VideoCategoryDetail | null>(null);
	let loadingEditId = $state('');

	const closeModal = () => {
		popup.remove(modalPopupId);
	};

	const openCreateModal = () => {
		modalMode = 'create';
		editingCategory = null;
		modalPopupId = popup.generateId();
		popup.custom({ id: modalPopupId, component: formModalSnippet });
	};

	const openEditModal = async (item: VideoCategoryItem) => {
		loadingEditId = item.id;
		try {
			const res = await fetch(`/admin-panel/api/video-category/${item.id}`);
			if (!res.ok) {
				popup.error({ message: 'Failed to load category details' });
				return;
			}
			const body = (await res.json()) as { data: VideoCategoryDetail };
			modalMode = 'edit';
			editingCategory = body.data;
			modalPopupId = popup.generateId();
			popup.custom({ id: modalPopupId, component: formModalSnippet });
		} finally {
			loadingEditId = '';
		}
	};

	// --- Delete ---
	let deleteForm: HTMLFormElement | undefined = $state();
	let deleteId = $state('');

	const confirmDelete = (item: VideoCategoryItem) => {
		popup.confirm({
			title: t.deleteConfirmTitle,
			message: t.deleteConfirmMessage,
			confirmText: t.deleteConfirmButton,
			cancelText: commonT.cancel,
			onConfirm: async () => {
				deleteId = item.id;
				await tick();
				deleteForm?.requestSubmit();
			}
		});
	};
</script>

<svelte:head>
	<title>{t.pageTitle}</title>
</svelte:head>

<form
	method="POST"
	action="?/delete"
	bind:this={deleteForm}
	use:enhance={() => {
		return async ({ update }) => {
			await update();
		};
	}}
	class="hidden"
>
	<input type="hidden" name="id" value={deleteId} />
</form>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="relative w-full max-w-sm">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
			/>
			<input
				type="text"
				bind:value={searchInput}
				oninput={onSearchInput}
				placeholder={t.searchPlaceholder}
				class="h-10 w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
			/>
		</div>
		<button
			type="button"
			onclick={openCreateModal}
			class="inline-flex items-center justify-center rounded-md bg-theme-600 px-4 py-2 text-sm font-medium text-white shadow-2xs transition-colors hover:bg-theme-700"
		>
			{t.addCategory}
		</button>
	</div>

	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<div
			class="hidden grid-cols-[1fr_240px_130px_90px] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold text-gray-500 uppercase md:grid"
		>
			<span>{t.tableName}</span>
			<span>{t.tableSlug}</span>
			<span>{t.tableVideos}</span>
			<span class="text-right">{t.tableAction}</span>
		</div>

		{#if !data.list || data.list.data.length === 0}
			<div class="px-5 py-12 text-center text-sm text-gray-500">
				{data.search ? t.emptySearch : t.empty}
			</div>
		{:else}
			<div class="divide-y divide-gray-100">
				{#each data.list.data as item (item.id)}
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
								onclick={() => openEditModal(item)}
								disabled={loadingEditId === item.id}
								aria-label={t.edit}
								title={t.edit}
								class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-theme-600 disabled:opacity-50"
							>
								<Pencil class="h-4 w-4" />
							</button>
							<button
								type="button"
								onclick={() => confirmDelete(item)}
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

	{#if data.list && data.list.totalPage > 1}
		<div class="flex items-center justify-between text-sm">
			<a
				href={buildHref(data.page - 1, data.search)}
				aria-disabled={data.page <= 1}
				class={`rounded-md border border-gray-300 px-3 py-1.5 font-medium transition-colors ${
					data.page <= 1 ? 'pointer-events-none text-gray-300' : 'text-gray-700 hover:bg-gray-50'
				}`}
			>
				{t.prev}
			</a>
			<span class="text-gray-500">
				{t.pageOf
					.replace('{current}', String(data.page))
					.replace('{total}', String(data.list.totalPage))}
			</span>
			<a
				href={buildHref(data.page + 1, data.search)}
				aria-disabled={data.page >= data.list.totalPage}
				class={`rounded-md border border-gray-300 px-3 py-1.5 font-medium transition-colors ${
					data.page >= data.list.totalPage
						? 'pointer-events-none text-gray-300'
						: 'text-gray-700 hover:bg-gray-50'
				}`}
			>
				{t.next}
			</a>
		</div>
	{/if}
</div>

{#snippet formModalSnippet()}
	<VideoCategoryFormModal
		mode={modalMode}
		category={editingCategory}
		contentLanguages={data.contentLanguages}
		onClose={closeModal}
		{t}
		cancelLabel={commonT.cancel}
	/>
{/snippet}
