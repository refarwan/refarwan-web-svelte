<script lang="ts">
	import { siFacebook, siGithub, siInstagram, siTiktok, siX, siYoutube } from 'simple-icons';

	interface SocialItem {
		name: string;
		href: string;
		path: string;
	}

	// Simple Icons 24x24 path for LinkedIn (removed in v14 of simple-icons library)
	const LINKEDIN_PATH =
		'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z';

	const SOCIAL_LINKS: SocialItem[] = [
		{ name: 'GitHub', href: 'https://github.com/refarwan', path: siGithub.path },
		{
			name: 'LinkedIn',
			href: 'https://www.linkedin.com/in/refarwan/',
			path: LINKEDIN_PATH
		},
		{
			name: 'Instagram',
			href: 'https://www.instagram.com/refarwan/',
			path: siInstagram.path
		},
		{
			name: 'Facebook',
			href: 'https://www.facebook.com/aan.refarwan.25/',
			path: siFacebook.path
		},
		{ name: 'X', href: 'https://x.com/refarwan', path: siX.path },
		{
			name: 'TikTok',
			href: 'https://www.tiktok.com/@refarwan',
			path: siTiktok.path
		},
		{
			name: 'YouTube',
			href: 'https://www.youtube.com/@kancaloco6159',
			path: siYoutube.path
		}
	];

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class={`flex flex-wrap items-center gap-3 ${className}`}>
	{#each SOCIAL_LINKS as item (item.name)}
		<a
			href={item.href}
			target="_blank"
			rel="noopener noreferrer external"
			aria-label={item.name}
			class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs transition-transform duration-200 hover:scale-110"
		>
			<svg role="img" viewBox="0 0 24 24" fill="currentColor" class="h-4.5 w-4.5 text-gray-800">
				<title>{item.name}</title>
				<path d={item.path} />
			</svg>
		</a>
	{/each}
</div>
