<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	import NotFoundContent from '$lib/components/NotFoundContent.svelte';
	import { getNotFoundTranslation } from '$lib/i18n/not-found';

	const t = getNotFoundTranslation('en');
	const homeHref = resolve('/[[lang=lang]]', { lang: undefined });
</script>

<div class="flex min-h-screen flex-col bg-white font-sans text-gray-900 antialiased">
	<main class="mx-auto flex max-w-7xl flex-1 items-center justify-center px-4">
		{#if page.status === 404}
			<NotFoundContent {t} {homeHref} contactHref={`${homeHref}#contact`} />
		{:else}
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<span class="text-6xl font-black tracking-tight text-theme-600 select-none"
					>{page.status}</span
				>
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
	</main>
</div>
