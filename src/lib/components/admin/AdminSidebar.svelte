<script lang="ts">
	import KeyRound from 'lucide-svelte/icons/key-round';
	import Settings from 'lucide-svelte/icons/settings';
	import UserRound from 'lucide-svelte/icons/user-round';
	import X from 'lucide-svelte/icons/x';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	import { adminSidebar } from '$lib/stores/admin-sidebar.svelte';

	import type { AdminTranslation } from '$lib/i18n/admin';

	interface Props {
		t: AdminTranslation['shell'];
	}

	let { t }: Props = $props();

	const homeHref = resolve('/admin-panel');

	const navItems = $derived([
		{ label: t.myAccount, href: resolve('/admin-panel/my-account'), icon: UserRound },
		{ label: t.changePassword, href: resolve('/admin-panel/change-password'), icon: KeyRound },
		{ label: t.settings, href: resolve('/admin-panel/settings'), icon: Settings }
	]);

	const isActive = (href: string): boolean => page.url.pathname === href;
</script>

{#snippet logo()}
	<a
		href={homeHref}
		onclick={() => (adminSidebar.open = false)}
		class="flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
	>
		<img src="/ercms-logo-row.png" alt="ERCMS Logo" class="h-8.75 w-37.5 object-contain" />
	</a>
{/snippet}

{#snippet nav()}
	<nav class="flex-1 space-y-1">
		{#each navItems as item (item.href)}
			<a
				href={item.href}
				onclick={() => (adminSidebar.open = false)}
				class={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
					isActive(item.href)
						? 'bg-theme-600 font-semibold text-white shadow-xs'
						: 'font-medium text-theme-100 hover:bg-white/10 hover:text-white'
				}`}
			>
				<item.icon class="h-5 w-5 shrink-0" />
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>
{/snippet}

<!-- Desktop sidebar -->
<aside class="hidden w-65 shrink-0 flex-col bg-theme-800 p-6 text-white xl:relative xl:flex">
	<div class="mb-6 flex items-center">
		{@render logo()}
	</div>
	{@render nav()}
</aside>

<!-- Mobile overlay sidebar -->
{#if adminSidebar.open}
	<div class="fixed inset-0 z-50 xl:hidden">
		<div
			class="fixed inset-0 bg-gray-600/50"
			onclick={() => (adminSidebar.open = false)}
			aria-hidden="true"
		></div>
		<aside class="fixed top-0 bottom-0 left-0 flex w-65 flex-col bg-theme-800 p-6 text-white">
			<div class="mb-6 flex items-center justify-between">
				{@render logo()}
				<button
					type="button"
					onclick={() => (adminSidebar.open = false)}
					aria-label="Close sidebar"
					class="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
				>
					<X class="h-5 w-5" />
				</button>
			</div>
			{@render nav()}
		</aside>
	</div>
{/if}
