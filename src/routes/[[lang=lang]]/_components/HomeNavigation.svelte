<script lang="ts">
	import { mobileMenu } from '$lib/stores/mobile-menu.svelte';

	import type { NavTranslation } from '$lib/i18n/nav';

	interface Props {
		t: NavTranslation;
		lang?: string;
		locale?: string;
		class?: string;
	}

	let { t, lang = 'en', locale = 'en-US', class: className = '' }: Props = $props();

	const DRAWER_LABELS: Record<string, string> = {
		en: 'Mobile navigation menu',
		id: 'Menu navigasi mobile',
		ja: 'モバイルナビゲーションメニュー'
	};

	const drawerAriaLabel = $derived(DRAWER_LABELS[lang.toLowerCase()] ?? DRAWER_LABELS.en);

	// /watch isn't migrated to this app yet; keep it locale-prefixed for when it lands.
	const localePrefix = $derived(lang === 'en' ? '' : `/${locale}`);

	const navItems = $derived([
		{ label: t.home, href: '#home' },
		{ label: t.about, href: '#about' },
		{ label: t.skills, href: '#skills' },
		{ label: t.projects, href: '#projects' },
		{ label: t.video, href: `${localePrefix}/watch` }
	]);

	$effect(() => {
		document.body.style.overflow = mobileMenu.open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<!-- Desktop & Tablet Navigation (Centered in Header Bar) -->
<div
	class={`pointer-events-none sticky top-0 z-40 -mt-16 hidden h-16 w-full items-center justify-center md:-mt-20 md:flex md:h-20 ${className}`}
>
	<nav class="pointer-events-auto flex items-center gap-7">
		{#each navItems as item, index (item.href)}
			<a
				href={item.href}
				class={`text-[15px] transition-colors ${
					index === 0
						? 'font-semibold text-theme-600'
						: 'font-medium text-gray-700 hover:text-theme-600'
				}`}
			>
				{item.label}
			</a>
		{/each}
	</nav>
</div>

<!-- Mobile Navigation Drawer -->
{#if mobileMenu.open}
	<div class="fixed inset-0 z-50 md:hidden">
		<div
			class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
			onclick={() => (mobileMenu.open = false)}
			aria-hidden="true"
		></div>

		<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
		<aside
			class="fixed top-0 bottom-0 left-0 z-50 flex h-full w-70 flex-col bg-white p-6 pb-10 shadow-2xl transition-transform"
			role="dialog"
			aria-modal="true"
			aria-label={drawerAriaLabel}
		>
			<div class="flex flex-col gap-2">
				{#each navItems as item, index (item.href)}
					<a
						href={item.href}
						onclick={() => (mobileMenu.open = false)}
						class={`rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
							index === 0
								? 'bg-theme-100 text-theme-600'
								: 'text-gray-700 hover:bg-theme-50 hover:text-theme-600'
						}`}
					>
						{item.label}
					</a>
				{/each}
			</div>
		</aside>
	</div>
{/if}
