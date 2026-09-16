<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	import Search from 'lucide-svelte/icons/search';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	import CategoryTable from './_components/CategoryTable.svelte';
	import Pagination from '$lib/components/admin/Pagination.svelte';
	import VideoCategoryFormModal from './_components/VideoCategoryFormModal.svelte';
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

	<CategoryTable
		{t}
		items={data.list?.data ?? []}
		search={data.search}
		{loadingEditId}
		onEdit={openEditModal}
		onDelete={confirmDelete}
	/>

	{#if data.list}
		<Pagination
			{t}
			page={data.page}
			totalPage={data.list.totalPage}
			buildHref={(page) => buildHref(page, data.search)}
		/>
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
