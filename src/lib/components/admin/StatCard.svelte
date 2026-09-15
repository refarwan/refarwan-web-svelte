<script lang="ts">
	import TrendingDown from 'lucide-svelte/icons/trending-down';
	import TrendingUp from 'lucide-svelte/icons/trending-up';

	import type { ComponentType, SvelteComponent } from 'svelte';

	interface Props {
		title: string;
		icon: ComponentType<SvelteComponent>;
		value: number;
		trend: number;
		vsLabel: string;
	}

	let { title, icon: Icon, value, trend, vsLabel }: Props = $props();
</script>

<div
	class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-2xs transition-colors hover:border-theme-300"
>
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium text-gray-600">{title}</span>
		<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-theme-50 text-theme-600">
			<Icon class="h-5 w-5" />
		</div>
	</div>

	<div class="mt-4">
		<p class="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">{value}</p>
		<div class="mt-2 flex items-center gap-1.5 text-xs md:text-sm">
			<span
				class={`inline-flex items-center gap-1 font-semibold ${trend < 0 ? 'text-red-600' : 'text-emerald-600'}`}
			>
				{#if trend < 0}
					<TrendingDown class="h-3.5 w-3.5" />
				{:else}
					<TrendingUp class="h-3.5 w-3.5" />
				{/if}
				{trend}%
			</span>
			<span class="font-normal text-gray-400">vs {vsLabel}</span>
		</div>
	</div>
</div>
