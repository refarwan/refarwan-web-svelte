<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	import NotFoundContent from '$lib/components/NotFoundContent.svelte';
	import { CONTENT_LANGUAGES } from '$lib/constants';
	import { getNotFoundTranslation } from '$lib/i18n/not-found';

	const langCode = $derived(
		CONTENT_LANGUAGES.find((item) => item.locale === page.params.lang)?.code ?? 'en'
	);
	const t = $derived(getNotFoundTranslation(langCode));
	const homeHref = $derived(resolve('/[[lang=lang]]', { lang: page.params.lang }));
	const contactHref = $derived(`${homeHref}#contact`);
</script>

{#if page.status === 404}
	<NotFoundContent {t} {homeHref} {contactHref} />
{:else}
	<div class="mx-auto flex w-full max-w-140 flex-col items-center justify-center py-20 text-center">
		<span class="text-6xl font-black tracking-tight text-theme-600 select-none">{page.status}</span>
		<p class="mt-4 text-sm leading-relaxed text-gray-500">
			{page.error?.message ?? 'Something went wrong.'}
		</p>
		<a
			href={homeHref}
			class="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-theme-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-theme-700"
		>
			{t.backHome}
		</a>
	</div>
{/if}
