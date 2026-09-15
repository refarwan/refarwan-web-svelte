<script lang="ts">
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import X from 'lucide-svelte/icons/x';

	import { enhance } from '$app/forms';

	import { SvelteURLSearchParams } from 'svelte/reactivity';

	import { popup } from '$lib/stores/popup.svelte';

	import type { AdminTranslation } from '$lib/i18n/admin';
	import type { ContentLanguage, VideoCategoryDetail } from '$lib/types';

	interface Props {
		mode: 'create' | 'edit';
		category: VideoCategoryDetail | null;
		contentLanguages: ContentLanguage[];
		onClose: () => void;
		t: AdminTranslation['watchCategory'];
		cancelLabel: string;
	}

	let { mode, category, contentLanguages, onClose, t, cancelLabel }: Props = $props();

	const slugify = (text: string): string =>
		text
			.toString()
			.toLowerCase()
			.trim()
			.replace(/[\s_]+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/--+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '');

	const seedNames = (): Record<string, string> => {
		const names: Record<string, string> = { en: category?.name ?? '' };
		for (const lang of contentLanguages) {
			if (lang.code === 'en') continue;
			const translation = category?.translations.find((t) => t.languageCode === lang.locale);
			names[lang.code] = translation?.name ?? '';
		}
		return names;
	};

	let activeLangCode = $state('en');
	let names = $state<Record<string, string>>(seedNames());
	let slug = $state(category?.slug ?? '');
	let slugManuallyEdited = $state(false);
	let slugStatus = $state<'idle' | 'checking' | 'available' | 'taken'>('idle');
	let suggestedSlug = $state('');
	let submitting = $state(false);
	let formEl: HTMLFormElement | undefined = $state();

	const activeLang = $derived(
		contentLanguages.find((lang) => lang.code === activeLangCode) ?? contentLanguages[0]
	);

	let slugCheckTimeout: ReturnType<typeof setTimeout> | undefined;

	const scheduleSlugCheck = (value: string) => {
		clearTimeout(slugCheckTimeout);

		if (!value.trim()) {
			slugStatus = 'idle';
			suggestedSlug = '';
			return;
		}

		slugStatus = 'checking';
		slugCheckTimeout = setTimeout(async () => {
			const params = new SvelteURLSearchParams({ slug: value });
			if (category?.slug) params.set('currentSlug', category.slug);

			try {
				const res = await fetch(`/admin-panel/api/video-category/slug-check?${params}`);
				if (!res.ok) return;
				const body = (await res.json()) as { data: { slug: string } };
				const availableSlug = body.data.slug;

				if (availableSlug === slugify(value)) {
					slugStatus = 'available';
					suggestedSlug = '';
				} else {
					slugStatus = 'taken';
					suggestedSlug = availableSlug;
				}
			} catch {
				slugStatus = 'idle';
			}
		}, 400);
	};

	const onNameInput = (event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		names[activeLangCode] = value;
		if (activeLangCode === 'en' && !slugManuallyEdited) {
			slug = slugify(value);
			scheduleSlugCheck(slug);
		}
	};

	const onSlugInput = (event: Event) => {
		slug = (event.target as HTMLInputElement).value;
		slugManuallyEdited = true;
		scheduleSlugCheck(slug);
	};

	const applySuggestedSlug = () => {
		if (!suggestedSlug) return;
		slug = suggestedSlug;
		slugManuallyEdited = true;
		slugStatus = 'available';
		suggestedSlug = '';
	};

	const hasAnyName = $derived(Object.values(names).some((name) => name.trim().length > 0));

	const translationsPayload = $derived(
		JSON.stringify(
			contentLanguages
				.filter((lang) => lang.code !== 'en' && names[lang.code]?.trim())
				.map((lang) => ({ languageCode: lang.locale, name: names[lang.code].trim() }))
		)
	);

	const primaryName = $derived(
		names.en?.trim() ||
			Object.values(names)
				.find((name) => name.trim().length > 0)
				?.trim() ||
			''
	);

	const onSubmit = (event: SubmitEvent) => {
		if (!hasAnyName) {
			event.preventDefault();
			event.stopImmediatePropagation();
			popup.error({ message: t.nameRequired });
		}
	};
</script>

<div class="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-2xl">
	<div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
		<h3 class="text-base font-semibold text-gray-900">
			{mode === 'create' ? t.addModalTitle : t.editModalTitle}
		</h3>
		<button
			type="button"
			onclick={onClose}
			class="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
		>
			<X class="h-5 w-5" />
		</button>
	</div>

	<form
		method="POST"
		action={mode === 'create' ? '?/create' : '?/update'}
		bind:this={formEl}
		onsubmit={onSubmit}
		use:enhance={() => {
			submitting = true;
			return async ({ result, update }) => {
				await update();
				if (result.type === 'success') {
					onClose();
				} else {
					submitting = false;
				}
			};
		}}
		class="flex flex-col gap-4 p-5"
	>
		{#if mode === 'edit' && category}
			<input type="hidden" name="id" value={category.id} />
		{/if}
		<input type="hidden" name="name" value={primaryName} />
		<input type="hidden" name="slug" value={slug} />
		<input type="hidden" name="translations" value={translationsPayload} />

		{#if contentLanguages.length > 1}
			<div class="flex flex-wrap gap-1.5">
				{#each contentLanguages as lang (lang.code)}
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

		<div class="flex flex-col gap-1.5">
			<label class="block text-[13px] font-medium text-gray-700" for="category-name">
				{t.nameLabel}
				{#if activeLang}
					<span class="font-normal text-gray-400">({activeLang.name})</span>
				{/if}
			</label>
			<input
				id="category-name"
				type="text"
				value={names[activeLangCode] ?? ''}
				oninput={onNameInput}
				placeholder={t.namePlaceholder}
				class="h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<label class="block text-[13px] font-medium text-gray-700" for="category-slug">
				{t.slugLabel}
			</label>
			<input
				id="category-slug"
				type="text"
				value={slug}
				oninput={onSlugInput}
				disabled={activeLangCode !== 'en'}
				class="h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
			/>
			<p class="text-[11px] text-gray-500">{t.slugHelper}</p>

			{#if activeLangCode === 'en' && slug.trim()}
				<div class="flex items-center gap-1.5 text-xs">
					{#if slugStatus === 'checking'}
						<Loader2 class="h-3.5 w-3.5 animate-spin text-gray-400" />
						<span class="text-gray-400">{t.slugCheckingLabel}</span>
					{:else if slugStatus === 'available'}
						<CircleCheck class="h-3.5 w-3.5 text-emerald-600" />
						<span class="text-emerald-600">{t.slugAvailableLabel}</span>
					{:else if slugStatus === 'taken'}
						<TriangleAlert class="h-3.5 w-3.5 text-amber-500" />
						<span class="text-amber-600">{t.slugTakenLabel}</span>
						<button
							type="button"
							onclick={applySuggestedSlug}
							class="cursor-pointer font-medium text-theme-600 underline hover:text-theme-700"
						>
							{t.useSuggestion} ({suggestedSlug})
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<div class="mt-2 flex justify-end gap-2 border-t border-gray-100 pt-4">
			<button
				type="button"
				onclick={onClose}
				class="cursor-pointer rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
			>
				{cancelLabel}
			</button>
			<button
				type="submit"
				disabled={submitting}
				class="flex cursor-pointer items-center gap-1.5 rounded-md bg-theme-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-theme-700 disabled:opacity-60"
			>
				{#if submitting}
					<Loader2 class="h-3.5 w-3.5 animate-spin" />
				{/if}
				{submitting ? t.saving : mode === 'create' ? t.saveCategory : t.saveChanges}
			</button>
		</div>
	</form>
</div>
