<script lang="ts">
    import Icon from "@iconify/svelte";

    interface SocialItem {
        name: string;
        href: string;
        icon: string;
    }

    const SOCIAL_LINKS: SocialItem[] = [
        { name: "GitHub", href: "https://github.com/refarwan", icon: "github" },
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/refarwan/",
            icon: "linkedin"
        },
        {
            name: "Instagram",
            href: "https://www.instagram.com/refarwan/",
            icon: "instagram"
        },
        {
            name: "Facebook",
            href: "https://www.facebook.com/aan.refarwan.25/",
            icon: "facebook"
        },
        { name: "X", href: "https://x.com/refarwan", icon: "twitter-x" },
        {
            name: "Threads",
            href: "https://www.threads.net/@refarwan",
            icon: "threads"
        },
        {
            name: "TikTok",
            href: "https://www.tiktok.com/@refarwan",
            icon: "tiktok"
        },
        {
            name: "YouTube",
            href: "https://www.youtube.com/@kancaloco6159",
            icon: "youtube"
        }
    ];

    interface Props {
        class?: string;
    }

    let { class: className = "" }: Props = $props();
</script>

<div class={`flex flex-wrap items-center gap-3 ${className}`}>
    {#each SOCIAL_LINKS as item (item.name)}
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer external"
            aria-label={item.name}
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-200 hover:scale-110"
        >
            <Icon icon={`bi:${item.icon}`} />
        </a>
    {/each}
</div>
