<script lang="ts">
	import type { HeroTranslation } from '$lib/i18n/home';

	interface Props {
		t: HeroTranslation;
	}

	let { t }: Props = $props();
</script>

<section id="home" class="w-full bg-white py-12 md:pt-16 md:pb-20 lg:pt-24 lg:pb-28">
	<div
		class="mx-auto flex max-w-320 flex-col-reverse items-center justify-between gap-12 px-5 md:px-10 lg:flex-row lg:gap-16 lg:px-16"
	>
		<div class="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
			<div class="space-y-2">
				<h1 class="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
					Aan Refarwan
				</h1>
				<p class="text-xl font-bold text-theme-600 md:text-2xl lg:text-[28px]">
					{t.role}
				</p>
			</div>

			<p class="mt-5 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
				{t.description}
			</p>

			<div class="mt-8">
				<a
					href="#projects"
					class="inline-flex h-13 items-center justify-center rounded-xl bg-theme-600 px-8 text-base font-semibold text-white shadow-md shadow-theme-600/25 transition-colors hover:bg-theme-700"
				>
					{t.viewProjects}
				</a>
			</div>
		</div>

		<div class="relative flex flex-1 items-center justify-center">
			<div
				class="absolute h-64 w-64 rounded-full bg-theme-500/25 blur-3xl md:h-80 md:w-80"
				aria-hidden="true"
			></div>

			<div
				class="relative h-64 w-64 overflow-hidden rounded-full border-8 border-white shadow-2xl md:h-80 md:w-80 lg:h-90 lg:w-90"
			>
				<img
					src="/images/profile.png"
					alt="Aan Refarwan - Fullstack JavaScript Developer"
					fetchpriority="high"
					class="h-full w-full object-cover"
				/>
			</div>
		</div>
	</div>
</section>
