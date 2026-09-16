<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

	import CategoryFilterChips from './_components/CategoryFilterChips.svelte';
	import Pagination from '$lib/components/admin/Pagination.svelte';
	import StatusFilterTabs from './_components/StatusFilterTabs.svelte';
	import VideoSearchHeader from './_components/VideoSearchHeader.svelte';
	import VideoTable from './_components/VideoTable.svelte';
	import { popup } from '$lib/stores/popup.svelte';

	import type { VideoItem } from '$lib/types';

	let { data, form } = $props();
	const t = $derived(data.t);
	const commonT = $derived(data.common);

	const basePath = resolve('/admin-panel/watch/video');

	let searchInput = $state(data.search);
	let searchDebounce: ReturnType<typeof setTimeout> | undefined;

	const statusTabs = $derived([
		{ value: '', label: t.statusAll },
		{ value: 'published', label: t.statusPublished },
		{ value: 'draft', label: t.statusDraft },
		{ value: 'archived', label: t.statusArchived }
	]);

	const buildHref = (
		page: number,
		search: string,
		status: string,
		categoryId: string = data.categoryIds[0] ?? ''
	): string => {
		const params = new SvelteURLSearchParams();
		if (search) params.set('search', search);
		if (status) params.set('status', status);
		if (categoryId) params.set('category', categoryId);
		if (page > 1) params.set('page', String(page));
		const qs = params.toString();
		return qs ? `${basePath}?${qs}` : basePath;
	};

	const onSearchInput = () => {
		clearTimeout(searchDebounce);
		searchDebounce = setTimeout(() => {
			void goto(buildHref(1, searchInput, data.status), { keepFocus: true, noScroll: true });
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

	let actionForm: HTMLFormElement | undefined = $state();
	let actionId = $state('');
	let actionName = $state<'archive' | 'unarchive' | 'delete'>('delete');

	const submitAction = async (id: string, action: 'archive' | 'unarchive' | 'delete') => {
		actionId = id;
		actionName = action;
		await tick();
		actionForm?.requestSubmit();
	};

	const confirmDelete = (item: VideoItem) => {
		popup.confirm({
			title: t.deleteConfirmTitle,
			message: t.deleteConfirmMessage,
			confirmText: t.deleteConfirmButton,
			cancelText: commonT.cancel,
			onConfirm: () => submitAction(item.id, 'delete')
		});
	};

	const confirmArchive = (item: VideoItem) => {
		popup.confirm({
			title: t.archiveConfirmTitle,
			message: t.archiveConfirmMessage,
			confirmText: t.archiveConfirmButton,
			cancelText: commonT.cancel,
			onConfirm: () => submitAction(item.id, 'archive')
		});
	};

	const confirmUnarchive = (item: VideoItem) => {
		popup.confirm({
			title: t.unarchiveConfirmTitle,
			message: t.unarchiveConfirmMessage,
			confirmText: t.unarchiveConfirmButton,
			cancelText: commonT.cancel,
			onConfirm: () => submitAction(item.id, 'unarchive')
		});
	};
</script>

<svelte:head>
	<title>{t.pageTitle}</title>
</svelte:head>

<form
	method="POST"
	action={`?/${actionName}`}
	bind:this={actionForm}
	use:enhance={() => {
		return async ({ update }) => {
			await update();
		};
	}}
	class="hidden"
>
	<input type="hidden" name="id" value={actionId} />
</form>

<div class="flex flex-col gap-4">
	<VideoSearchHeader
		{t}
		bind:value={searchInput}
		onInput={onSearchInput}
		addHref={resolve('/admin-panel/watch/create')}
	/>

	<StatusFilterTabs
		tabs={statusTabs}
		activeValue={data.status}
		buildHref={(value) => buildHref(1, data.search, value)}
	/>

	<CategoryFilterChips
		{t}
		categories={data.categories}
		activeCategoryIds={data.categoryIds}
		buildHref={(categoryId) => buildHref(1, data.search, data.status, categoryId)}
	/>

	<VideoTable
		{t}
		items={data.list?.data ?? []}
		search={data.search}
		onArchive={confirmArchive}
		onUnarchive={confirmUnarchive}
		onDelete={confirmDelete}
	/>

	{#if data.list}
		<Pagination
			{t}
			page={data.page}
			totalPage={data.list.totalPage}
			buildHref={(page) => buildHref(page, data.search, data.status)}
		/>
	{/if}
</div>
