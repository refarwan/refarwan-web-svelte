<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	import Archive from 'lucide-svelte/icons/archive';
	import ArchiveRestore from 'lucide-svelte/icons/archive-restore';
	import Search from 'lucide-svelte/icons/search';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';

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

	const formatDate = (iso: string): string =>
		new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
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
		<a
			href={resolve('/admin-panel/watch/create')}
			class="inline-flex items-center justify-center rounded-md bg-theme-600 px-4 py-2 text-sm font-medium text-white shadow-2xs transition-colors hover:bg-theme-700"
		>
			{t.addVideo}
		</a>
	</div>

	<div class="flex flex-wrap gap-1.5">
		{#each statusTabs as tab (tab.value)}
			<a
				href={buildHref(1, data.search, tab.value)}
				class={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
					data.status === tab.value
						? 'border-theme-600 bg-theme-600 text-white'
						: 'border-gray-200 text-gray-600 hover:bg-gray-50'
				}`}
			>
				{tab.label}
			</a>
		{/each}
	</div>

	{#if data.categories.length > 0}
		<div class="flex flex-wrap gap-1.5">
			<a
				href={buildHref(1, data.search, data.status, '')}
				class={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
					data.categoryIds.length === 0
						? 'border-theme-600 bg-theme-50 text-theme-700'
						: 'border-gray-200 text-gray-500 hover:bg-gray-50'
				}`}
			>
				{t.tableCategory}: {t.statusAll}
			</a>
			{#each data.categories as category (category.id)}
				<a
					href={buildHref(1, data.search, data.status, category.id)}
					class={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
						data.categoryIds.includes(category.id)
							? 'border-theme-600 bg-theme-50 text-theme-700'
							: 'border-gray-200 text-gray-500 hover:bg-gray-50'
					}`}
				>
					{category.name}
				</a>
			{/each}
		</div>
	{/if}

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

		{#if !data.list || data.list.data.length === 0}
			<div class="px-5 py-12 text-center text-sm text-gray-500">
				{data.search ? t.emptySearch : t.empty}
			</div>
		{:else}
			<div class="divide-y divide-gray-100">
				{#each data.list.data as item (item.id)}
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
									onclick={() => confirmUnarchive(item)}
									aria-label={t.unarchive}
									title={t.unarchive}
									class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-theme-600"
								>
									<ArchiveRestore class="h-4 w-4" />
								</button>
							{:else}
								<button
									type="button"
									onclick={() => confirmArchive(item)}
									aria-label={t.archive}
									title={t.archive}
									class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-theme-600"
								>
									<Archive class="h-4 w-4" />
								</button>
							{/if}
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
				href={buildHref(data.page - 1, data.search, data.status)}
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
				href={buildHref(data.page + 1, data.search, data.status)}
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
