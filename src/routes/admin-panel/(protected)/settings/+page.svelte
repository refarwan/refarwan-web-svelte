<script lang="ts">
	import { tick, untrack } from 'svelte';

	import { beforeNavigate } from '$app/navigation';
	import { enhance } from '$app/forms';

	import AddLanguageModal from '$lib/components/admin/AddLanguageModal.svelte';
	import ColorPickerModal from '$lib/components/admin/ColorPickerModal.svelte';
	import DropdownSelect from '$lib/components/admin/DropdownSelect.svelte';
	import { CONTENT_LANGUAGES, DEFAULT_THEME_SHADES } from '$lib/constants';
	import { popup } from '$lib/stores/popup.svelte';
	import { generateColorShades } from '$lib/utils/generate-color-shades';

	import type { ThemeShades } from '$lib/types';

	let { data, form } = $props();
	const t = $derived(data.t);
	const commonT = $derived(data.common);
	// Seeded once from the initial load; the form below owns these values from then on.
	const setting = untrack(() => data.setting);

	let title = $state(setting?.appMetadata.title ?? '');
	let description = $state(setting?.appMetadata.description ?? '');
	let faviconPreview = $state(setting?.appMetadata.favicon ?? '');
	let faviconFile: File | null = $state(null);
	let faviconInput: HTMLInputElement | undefined = $state();

	let selectedColor = $state(setting?.theme['500'] ?? DEFAULT_THEME_SHADES['500']);
	let themeShades = $state<ThemeShades>(setting?.theme ?? DEFAULT_THEME_SHADES);
	let isThemeChanged = $state(false);

	let otherContentLanguages = $state<string[]>(setting?.otherContentLanguages ?? []);

	let adminLang = $state(data.adminLang);
	let adminLangForm: HTMLFormElement | undefined = $state();
	let adminLangPending = $state(false);

	let snapshot = $state(
		untrack(() => ({
			title,
			description,
			color: selectedColor,
			languages: [...otherContentLanguages]
		}))
	);

	const isDirty = $derived(
		title !== snapshot.title ||
			description !== snapshot.description ||
			faviconFile !== null ||
			isThemeChanged ||
			selectedColor !== snapshot.color ||
			otherContentLanguages.join(',') !== snapshot.languages.join(',')
	);

	const availableLanguages = $derived(
		CONTENT_LANGUAGES.filter(
			(lang) => lang.code !== 'en' && !otherContentLanguages.includes(lang.locale)
		)
	);

	const activeLanguages = $derived(
		otherContentLanguages
			.map((locale) => CONTENT_LANGUAGES.find((lang) => lang.locale === locale))
			.filter((lang) => lang !== undefined)
	);

	const adminLangOptions = [
		{ value: 'en-US', label: 'English', icon: '🇬🇧' },
		{ value: 'id-ID', label: 'Indonesia', icon: '🇮🇩' }
	];

	const onFaviconChange = (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		faviconFile = file;
		faviconPreview = URL.createObjectURL(file);
	};

	const onColorChange = (color: string) => {
		selectedColor = color;
		isThemeChanged = true;
		const shades = generateColorShades(selectedColor);
		if (shades) themeShades = shades;
	};

	const onAddLanguage = (locale: string) => {
		if (otherContentLanguages.includes(locale)) return;
		otherContentLanguages = [...otherContentLanguages, locale];
	};

	const onRemoveLanguage = (locale: string) => {
		otherContentLanguages = otherContentLanguages.filter((code) => code !== locale);
	};

	const onAdminLangChange = async (lang: string) => {
		if (lang !== 'en-US' && lang !== 'id-ID') return;
		adminLang = lang;
		adminLangPending = true;
		// The hidden input's value is bound reactively, so wait for Svelte to flush
		// the DOM update before reading it via requestSubmit(), otherwise the form
		// would submit the previous (stale) language value.
		await tick();
		adminLangForm?.requestSubmit();
	};

	let colorPickerPopupId = $state('');
	let addLanguagePopupId = $state('');

	const openColorPicker = () => {
		colorPickerPopupId = popup.generateId();
		popup.custom({ id: colorPickerPopupId, component: colorPickerSnippet });
	};

	const openAddLanguageModal = () => {
		addLanguagePopupId = popup.generateId();
		popup.custom({ id: addLanguagePopupId, component: addLanguageSnippet });
	};

	const handleResetTheme = () => {
		popup.confirm({
			title: t.resetTitle,
			message: t.resetConfirm,
			confirmText: t.resetDefault,
			cancelText: commonT.cancel,
			onConfirm: () => {
				resetting = true;
				mainForm?.requestSubmit(resetButton);
			}
		});
	};

	let submitting = $state(false);
	let resetting = $state(false);
	let mainForm: HTMLFormElement | undefined = $state();
	let resetButton: HTMLButtonElement | undefined = $state();

	beforeNavigate(({ cancel }) => {
		if (isDirty && !confirm(commonT.unsavedMessage)) {
			cancel();
		}
	});

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

	$effect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (isDirty) event.preventDefault();
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	});
</script>

<svelte:head>
	<title>{t.metadataTitle}</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-4">
	<form
		method="POST"
		action="?/save"
		enctype="multipart/form-data"
		bind:this={mainForm}
		use:enhance={() => {
			const wasResetting = resetting;
			submitting = !wasResetting;
			return async ({ result, update }) => {
				await update();
				submitting = false;
				resetting = false;
				if (result.type === 'success') {
					if (wasResetting) {
						themeShades = DEFAULT_THEME_SHADES;
						selectedColor = DEFAULT_THEME_SHADES['500'];
						isThemeChanged = false;
					}
					snapshot = {
						title,
						description,
						color: selectedColor,
						languages: [...otherContentLanguages]
					};
					faviconFile = null;
					isThemeChanged = false;
				}
			};
		}}
		class="flex flex-col gap-4"
	>
		<!-- Metadata -->
		<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
			<h2 class="text-base font-semibold text-gray-900">{t.metadataTitle}</h2>
			<p class="text-[13px] text-gray-500">{t.metadataDescription}</p>
			<hr class="my-4 border-gray-200" />

			<div class="flex flex-col gap-4">
				<div>
					<label class="block text-[13px] font-medium text-gray-700" for="title">
						{t.siteTitle}
					</label>
					<input
						id="title"
						name="title"
						bind:value={title}
						required
						class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-[13px] font-medium text-gray-700" for="description">
						{t.siteDescription}
					</label>
					<input
						id="description"
						name="description"
						bind:value={description}
						required
						class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>

				<button
					type="button"
					onclick={() => faviconInput?.click()}
					class="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 p-3 text-left hover:border-theme-400"
				>
					{#if faviconPreview}
						<img src={faviconPreview} alt={t.favicon} class="h-10 w-10 rounded object-cover" />
					{/if}
					<span class="text-sm text-gray-600">{t.faviconHint}</span>
				</button>
				<input
					bind:this={faviconInput}
					onchange={onFaviconChange}
					type="file"
					name="favicon"
					accept="image/png"
					class="hidden"
				/>
			</div>
		</section>

		<!-- Theme -->
		<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-base font-semibold text-gray-900">{t.themeTitle}</h2>
					<p class="text-[13px] text-gray-500">{t.themeDescription}</p>
				</div>
				<div class="flex items-center gap-2">
					<button
						type="submit"
						formaction="?/resetTheme"
						bind:this={resetButton}
						disabled={resetting}
						onclick={(event) => {
							event.preventDefault();
							handleResetTheme();
						}}
						class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
					>
						{resetting ? t.saving : t.resetDefault}
					</button>
					<button
						type="button"
						onclick={openColorPicker}
						class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-theme-600 px-3 py-1.5 text-sm font-medium text-theme-600 transition-colors hover:bg-theme-50"
					>
						<span
							class="inline-block h-3.5 w-3.5 shrink-0 rounded-full"
							style="background: conic-gradient(from 90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
						></span>
						<span>{t.pickColor}</span>
					</button>
				</div>
			</div>
			<input type="hidden" name="colorCode" value={isThemeChanged ? selectedColor : ''} />
			<hr class="my-4 border-gray-200" />

			<div class="flex flex-wrap gap-3">
				{#each Object.entries(themeShades) as [shade, hex] (shade)}
					<div class="flex flex-col items-center gap-1">
						<div
							class="h-10 w-10 rounded-lg border border-gray-200"
							style={`background:${hex}`}
						></div>
						<span class="text-xs text-gray-500">{shade}</span>
					</div>
				{/each}
			</div>
		</section>

		<!-- Content Languages -->
		<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
			<h2 class="text-base font-semibold text-gray-900">{t.languagesTitle}</h2>
			<p class="text-[13px] text-gray-500">{t.languagesDescription}</p>
			<hr class="my-4 border-gray-200" />

			<input
				type="hidden"
				name="otherContentLanguages"
				value={JSON.stringify(otherContentLanguages)}
			/>

			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
					<span class="flex items-center gap-2 text-sm text-gray-700">
						<span>🇬🇧</span>
						English
					</span>
					<span class="rounded-full bg-theme-50 px-2.5 py-0.5 text-xs font-medium text-theme-700">
						{t.defaultLanguage}
					</span>
				</div>
				{#each activeLanguages as lang (lang.locale)}
					<div
						class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
					>
						<span class="flex items-center gap-2 text-sm text-gray-700">
							<span>{lang.flag}</span>
							{lang.name}
						</span>
						<button
							type="button"
							onclick={() => onRemoveLanguage(lang.locale)}
							class="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
						>
							{t.removeLanguage}
						</button>
					</div>
				{/each}
			</div>

			{#if availableLanguages.length > 0}
				<div class="mt-3">
					<button
						type="button"
						onclick={openAddLanguageModal}
						class="inline-flex cursor-pointer items-center rounded-md border border-theme-600 px-4 py-2 text-[13px] font-medium text-theme-600 transition-colors hover:bg-theme-50"
					>
						{t.addLanguage}
					</button>
				</div>
			{/if}
		</section>

		<div class="flex justify-end">
			<button
				type="submit"
				disabled={submitting || !isDirty}
				class="rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-theme-700 disabled:opacity-50"
			>
				{submitting ? t.saving : t.save}
			</button>
		</div>
	</form>

	<!-- Admin Panel Language (auto-saved, independent of the form above) -->
	<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
		<div class="flex items-start justify-between gap-4">
			<div>
				<h2 class="text-base font-semibold text-gray-900">{t.adminLanguageTitle}</h2>
				<p class="mt-1 text-xs text-gray-500">{t.adminLanguageDescription}</p>
			</div>
			<span
				class="inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
			>
				{t.autoSaved}
			</span>
		</div>
		<hr class="my-4 border-gray-200" />

		<form
			method="POST"
			action="?/setAdminLang"
			bind:this={adminLangForm}
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					adminLangPending = false;
				};
			}}
		>
			<input type="hidden" name="lang" value={adminLang} />
			<div class="max-w-xs">
				<DropdownSelect
					label={t.displayLanguage}
					value={adminLang}
					options={adminLangOptions}
					onChange={onAdminLangChange}
					helperText={t.languageHelper}
					disabled={adminLangPending}
				/>
			</div>
		</form>
	</section>
</div>

{#snippet colorPickerSnippet()}
	<ColorPickerModal
		initialColor={selectedColor}
		onClose={() => popup.remove(colorPickerPopupId)}
		onSelectColor={onColorChange}
		title={t.pickColor}
		shadesPreviewLabel={t.shadesPreview}
		cancelLabel={commonT.cancel}
		applyLabel={t.applyColor}
	/>
{/snippet}

{#snippet addLanguageSnippet()}
	<AddLanguageModal
		activeCodes={CONTENT_LANGUAGES.filter((lang) =>
			lang.code === 'en' ? true : otherContentLanguages.includes(lang.locale)
		).map((lang) => lang.code)}
		onClose={() => popup.remove(addLanguagePopupId)}
		{onAddLanguage}
		title={t.addLanguageModalTitle}
		searchPlaceholder={t.addLanguagePlaceholder}
		defaultLabel={t.defaultLanguage}
		activeLabel={t.activeLanguage}
		addLabel={t.addLanguageAction}
		doneLabel={t.done}
		closeLabel={t.closeModal}
	/>
{/snippet}
