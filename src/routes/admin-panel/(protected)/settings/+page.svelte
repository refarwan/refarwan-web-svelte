<script lang="ts">
	import { untrack } from 'svelte';

	import { enhance } from '$app/forms';

	import AddLanguageModal from './_components/AddLanguageModal.svelte';
	import AdminLanguageSection from './_components/AdminLanguageSection.svelte';
	import ColorPickerModal from './_components/ColorPickerModal.svelte';
	import LanguagesFormSection from './_components/LanguagesFormSection.svelte';
	import MetadataFormSection from './_components/MetadataFormSection.svelte';
	import ThemeFormSection from './_components/ThemeFormSection.svelte';
	import { CONTENT_LANGUAGES, DEFAULT_THEME_SHADES } from '$lib/constants';
	import { popup } from '$lib/stores/popup.svelte';
	import { generateColorShades } from '$lib/utils/generate-color-shades';
	import { useUnsavedChangesGuard } from '$lib/utils/unsaved-changes-guard.svelte';

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

	let selectedColor = $state(setting?.theme['500'] ?? DEFAULT_THEME_SHADES['500']);
	let themeShades = $state<ThemeShades>(setting?.theme ?? DEFAULT_THEME_SHADES);
	let isThemeChanged = $state(false);

	let otherContentLanguages = $state<string[]>(setting?.otherContentLanguages ?? []);

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

	useUnsavedChangesGuard(
		() => isDirty,
		() => commonT.unsavedMessage
	);

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
		<MetadataFormSection {t} bind:title bind:description bind:faviconPreview bind:faviconFile />

		<ThemeFormSection
			{t}
			{themeShades}
			{isThemeChanged}
			{selectedColor}
			{resetting}
			onOpenColorPicker={openColorPicker}
			onResetTheme={handleResetTheme}
			bind:resetButton
		/>

		<LanguagesFormSection
			{t}
			{otherContentLanguages}
			{availableLanguages}
			{activeLanguages}
			{onRemoveLanguage}
			onOpenAddLanguageModal={openAddLanguageModal}
		/>

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

	<AdminLanguageSection {t} initialLang={data.adminLang} />
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
