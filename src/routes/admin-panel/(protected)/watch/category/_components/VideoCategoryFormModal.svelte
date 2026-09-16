<script lang="ts">
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import X from 'lucide-svelte/icons/x';

	import { enhance } from '$app/forms';

	import { SvelteURLSearchParams } from 'svelte/reactivity';

	import CategoryNameField from './CategoryNameField.svelte';
	import LanguageTabs from '$lib/components/admin/LanguageTabs.svelte';
	import SlugField from './SlugField.svelte';
	import { popup } from '$lib/stores/popup.svelte';
	import { slugify } from '$lib/utils/slugify';

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

	const onNameInput = (value: string) => {
		names[activeLangCode] = value;
		if (activeLangCode === 'en' && !slugManuallyEdited) {
			slug = slugify(value);
			scheduleSlugCheck(slug);
		}
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

		<LanguageTabs
			languages={contentLanguages}
			activeCode={activeLangCode}
			onSelect={(code) => (activeLangCode = code)}
		/>

		<CategoryNameField
			{t}
			{activeLang}
			value={names[activeLangCode] ?? ''}
			onInput={onNameInput}
		/>

		<SlugField
			{t}
			{slug}
			disabled={activeLangCode !== 'en'}
			status={slugStatus}
			{suggestedSlug}
			onInput={(value) => {
				slug = value;
				slugManuallyEdited = true;
				scheduleSlugCheck(slug);
			}}
			onApplySuggestion={applySuggestedSlug}
		/>

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
