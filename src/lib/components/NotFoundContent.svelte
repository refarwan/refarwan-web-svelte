<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';

	import type { NotFoundTranslation } from '$lib/i18n/not-found';

	interface Props {
		t: NotFoundTranslation;
		homeHref: string;
		contactHref: string;
	}

	let { t, homeHref, contactHref }: Props = $props();
</script>

<svelte:head>
	<title>{t.heading} | Aan Refarwan</title>
	<meta name="description" content={t.subtext} />
</svelte:head>

<div
	class="mx-auto flex w-full max-w-85.5 flex-col items-center justify-center py-14 text-center md:max-w-140 md:py-18 lg:max-w-190 lg:py-24"
>
	<div class="relative flex w-full items-center justify-center">
		<svg
			viewBox="0 0 800 560"
			class="pointer-events-none absolute -top-8 left-1/2 z-0 w-130 max-w-none -translate-x-1/2 md:-top-14 md:w-177.5 lg:-top-16 lg:w-200"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<g opacity="0.08" filter="url(#glow-blur-1)">
				<circle cx="280" cy="280" r="160" fill="var(--color-theme-600, #0284C7)" />
			</g>
			<g opacity="0.06" filter="url(#glow-blur-2)">
				<circle cx="570" cy="270" r="130" fill="var(--color-theme-600, #0284C7)" />
			</g>
			<circle opacity="0.9" cx="230" cy="470" r="90" fill="var(--color-theme-100, #E0F2FE)" />
			<rect
				opacity="0.18"
				x="580"
				y="150"
				width="120"
				height="12"
				rx="6"
				fill="var(--color-theme-600, #0284C7)"
			/>
			<rect
				opacity="0.18"
				x="150"
				y="420"
				width="120"
				height="12"
				rx="6"
				fill="var(--color-theme-600, #0284C7)"
			/>
			<circle opacity="0.12" cx="600" cy="390" r="10" fill="var(--color-theme-600, #0284C7)" />
			<circle opacity="0.12" cx="150" cy="150" r="10" fill="var(--color-theme-600, #0284C7)" />
			<rect
				opacity="0.95"
				x="520"
				y="340"
				width="88"
				height="56"
				rx="16"
				fill="var(--color-theme-100, #E0F2FE)"
			/>
			<rect
				opacity="0.12"
				x="120"
				y="340"
				width="88"
				height="56"
				rx="16"
				fill="var(--color-theme-600, #0284C7)"
			/>
			<defs>
				<filter
					id="glow-blur-1"
					x="0"
					y="0"
					width="560"
					height="560"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
					<feGaussianBlur stdDeviation="60" />
				</filter>
				<filter
					id="glow-blur-2"
					x="340"
					y="40"
					width="460"
					height="460"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
					<feGaussianBlur stdDeviation="50" />
				</filter>
			</defs>
		</svg>

		<span
			class="relative z-10 text-8xl font-black tracking-tight text-theme-600 select-none md:text-[180px] md:leading-45 lg:text-[220px] lg:leading-60"
		>
			404
		</span>
	</div>

	<div class="relative z-10 mt-4 flex flex-col items-center gap-3 md:mt-6 md:gap-4">
		<h1
			class="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl lg:text-[40px] lg:leading-tight"
		>
			{t.heading}
		</h1>
		<p class="max-w-md text-sm leading-relaxed text-gray-500 md:max-w-lg md:text-base lg:text-lg">
			{t.subtext}
		</p>
	</div>

	<div
		class="relative z-10 mt-8 flex w-full flex-col items-center justify-center gap-3 md:w-auto md:flex-row md:gap-4"
	>
		<a
			href={homeHref}
			class="inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-theme-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-theme-700 md:w-auto"
		>
			<ArrowLeft class="h-4 w-4" />
			<span>{t.backHome}</span>
		</a>

		<a
			href={contactHref}
			class="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-[15px] font-semibold text-theme-600 transition-colors hover:bg-gray-50 md:w-auto"
		>
			<span>{t.contactUs}</span>
		</a>
	</div>
</div>
