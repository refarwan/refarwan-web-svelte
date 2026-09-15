<script lang="ts">
	import X from 'lucide-svelte/icons/x';

	import { DEFAULT_THEME_SHADES } from '$lib/constants';
	import { generateColorShades } from '$lib/utils/generate-color-shades';

	import type { ThemeShades } from '$lib/types';

	interface Props {
		initialColor: string;
		onClose: () => void;
		onSelectColor: (color: string) => void;
		title: string;
		shadesPreviewLabel: string;
		cancelLabel: string;
		applyLabel: string;
	}

	let {
		initialColor,
		onClose,
		onSelectColor,
		title,
		shadesPreviewLabel,
		cancelLabel,
		applyLabel
	}: Props = $props();

	const SHADE_KEYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

	let color = $state(initialColor);
	let previewShades = $state<ThemeShades>(
		generateColorShades(initialColor) ?? DEFAULT_THEME_SHADES
	);

	const handleColorChange = (newColor: string): void => {
		color = newColor;
		const shades = generateColorShades(newColor);
		if (shades) previewShades = shades;
	};

	const handleApply = (): void => {
		onSelectColor(color);
		onClose();
	};
</script>

<div
	class="flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-2xl"
>
	<div class="flex items-center justify-between border-b border-gray-100 pb-3">
		<h3 class="text-base font-semibold text-gray-900">{title}</h3>
		<button
			type="button"
			onclick={onClose}
			class="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
		>
			<X class="h-5 w-5" />
		</button>
	</div>

	<div class="flex justify-center py-1">
		<input
			type="color"
			value={color}
			oninput={(event) => handleColorChange((event.target as HTMLInputElement).value)}
			class="h-32 w-full cursor-pointer rounded-lg border border-gray-200"
		/>
	</div>

	<div class="flex items-center gap-2">
		<span
			class="h-10 w-10 shrink-0 rounded-lg border border-gray-300 shadow-xs"
			style={`background-color:${color}`}
		></span>
		<input
			type="text"
			value={color}
			oninput={(event) => handleColorChange((event.target as HTMLInputElement).value)}
			placeholder="#000000"
			class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-800 uppercase outline-none focus:border-theme-500 focus:ring-1 focus:ring-theme-500"
		/>
	</div>

	<div class="flex flex-col gap-1.5">
		<span class="text-xs font-medium text-gray-500">{shadesPreviewLabel}</span>
		<div class="grid grid-cols-11 gap-1">
			{#each SHADE_KEYS as key (key)}
				{@const hex = previewShades[key] || '#ffffff'}
				<div class="flex flex-col items-center gap-1" title={`${key}: ${hex}`}>
					<div
						class="h-7 w-full rounded-sm border border-black/10 shadow-2xs"
						style={`background-color:${hex}`}
					></div>
					<span class="text-[9px] font-medium text-gray-400">{key}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex justify-end gap-2 border-t border-gray-100 pt-3">
		<button
			type="button"
			onclick={onClose}
			class="cursor-pointer rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
		>
			{cancelLabel}
		</button>
		<button
			type="button"
			onclick={handleApply}
			class="cursor-pointer rounded-md bg-theme-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-theme-700"
		>
			{applyLabel}
		</button>
	</div>
</div>
