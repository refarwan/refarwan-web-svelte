<script lang="ts">
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	import type { ProjectsTranslation } from '$lib/i18n/home';

	interface Props {
		t: ProjectsTranslation;
	}

	let { t }: Props = $props();
</script>

<section id="projects" class="w-full bg-theme-50 py-16 md:py-20 lg:py-28">
	<div class="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
		<div class="max-w-2xl">
			<h2 class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
				{t.title}
			</h2>
			<p class="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">
				{t.subtitle}
			</p>
		</div>

		<div class="mt-10 flex flex-col gap-8 md:mt-12 md:gap-10">
			{#each t.items as project, index (project.id)}
				{@const isEven = index % 2 === 1}
				<div
					class="grid grid-cols-1 items-center gap-8 rounded-3xl border border-theme-100/80 bg-white p-6 shadow-xs md:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10"
				>
					<div
						class={`relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 lg:col-span-6 ${
							isEven ? 'lg:order-2' : ''
						}`}
					>
						<img
							src={project.imageSrc}
							alt={`${project.projectName} Mockup`}
							loading="lazy"
							class="h-full w-full object-cover transition-transform duration-300 hover:scale-102"
						/>
					</div>

					<div class={`flex flex-col items-start lg:col-span-6 ${isEven ? 'lg:order-1' : ''}`}>
						<span
							class="inline-flex items-center rounded-full bg-theme-100 px-3.5 py-1 text-xs font-semibold text-theme-700"
						>
							{project.category}
						</span>

						<h3 class="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
							{project.projectName}
						</h3>

						<p class="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
							{project.description}
						</p>

						<a
							href={project.url}
							target="_blank"
							rel="noopener noreferrer external"
							class="group mt-6 inline-flex items-center gap-2 text-base font-semibold text-theme-600 transition-colors hover:text-theme-700"
						>
							<span>{project.visitWebsite}</span>
							<ArrowRight
								class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
							/>
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
