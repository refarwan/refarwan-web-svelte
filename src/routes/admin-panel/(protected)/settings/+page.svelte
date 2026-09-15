<script lang="ts">
	import { untrack } from 'svelte';

	import { beforeNavigate } from '$app/navigation';
	import { enhance } from '$app/forms';

	import { CONTENT_LANGUAGES, DEFAULT_THEME_SHADES } from '$lib/constants';
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
	let addLanguageValue = $state('');

	let adminLangForm: HTMLFormElement | undefined = $state();

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

	const onFaviconChange = (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		faviconFile = file;
		faviconPreview = URL.createObjectURL(file);
	};

	const onColorChange = (event: Event) => {
		selectedColor = (event.target as HTMLInputElement).value;
		isThemeChanged = true;
		const shades = generateColorShades(selectedColor);
		if (shades) themeShades = shades;
	};

	const onAddLanguage = () => {
		if (!addLanguageValue) return;
		otherContentLanguages = [...otherContentLanguages, addLanguageValue];
		addLanguageValue = '';
	};

	const onRemoveLanguage = (locale: string) => {
		otherContentLanguages = otherContentLanguages.filter((code) => code !== locale);
	};

	const onAdminLangChange = () => {
		adminLangForm?.requestSubmit();
	};

	let submitting = $state(false);
	let resetting = $state(false);

	beforeNavigate(({ cancel }) => {
		if (isDirty && !confirm(commonT.unsavedMessage)) {
			cancel();
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
	{#if form?.error}
		<p class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</p>
	{/if}
	{#if form?.success && form.message}
		<p class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{form.message}</p>
	{/if}

	<form
		method="POST"
		action="?/save"
		enctype="multipart/form-data"
		use:enhance={() => {
			submitting = true;
			return async ({ result, update }) => {
				await update();
				submitting = false;
				if (result.type === 'success') {
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
					<input
						type="color"
						value={selectedColor}
						onchange={onColorChange}
						aria-label={t.pickColor}
						class="h-9 w-9 cursor-pointer rounded-lg border border-gray-300 p-0.5"
					/>
					<button
						type="submit"
						formaction="?/resetTheme"
						disabled={resetting}
						onclick={(event) => {
							if (!confirm(t.resetConfirm)) event.preventDefault();
							else resetting = true;
						}}
						class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						{t.resetDefault}
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
				<div class="mt-3 flex gap-2">
					<select
						bind:value={addLanguageValue}
						class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-theme-500 focus:outline-none"
					>
						<option value="">{t.addLanguagePlaceholder}</option>
						{#each availableLanguages as lang (lang.locale)}
							<option value={lang.locale}>{lang.flag} {lang.name}</option>
						{/each}
					</select>
					<button
						type="button"
						onclick={onAddLanguage}
						disabled={!addLanguageValue}
						class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-base font-semibold text-gray-900">{t.adminLanguageTitle}</h2>
				<p class="text-[13px] text-gray-500">{t.adminLanguageDescription}</p>
			</div>
			<span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
				{t.autoSaved}
			</span>
		</div>
		<hr class="my-4 border-gray-200" />

		<form method="POST" action="?/setAdminLang" bind:this={adminLangForm} use:enhance>
			<select
				name="lang"
				value={data.adminLang}
				onchange={onAdminLangChange}
				class="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-theme-500 focus:outline-none"
			>
				<option value="en-US">English</option>
				<option value="id-ID">Indonesia</option>
			</select>
		</form>
	</section>
</div>
