<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { SkillsTranslation } from "$lib/i18n/home";

    interface SkillItem {
        name: string;
        icon: string;
    }

    const FALLBACK_SKILLS: SkillItem[] = [
        { name: "HTML", icon: "simple-icons:html5" },
        { name: "CSS", icon: "simple-icons:css3" },
        { name: "JavaScript", icon: "simple-icons:javascript" },
        { name: "TypeScript", icon: "simple-icons:typescript" },
        { name: "PHP", icon: "simple-icons:php" },
        { name: "Node.Js", icon: "simple-icons:nodedotjs" },
        { name: "Bun", icon: "simple-icons:bun" },
        { name: "Express.Js", icon: "simple-icons:express" },
        { name: "NestJs", icon: "simple-icons:nestjs" },
        { name: "Hono", icon: "simple-icons:hono" },
        { name: "Laravel", icon: "simple-icons:laravel" },
        { name: "React.Js", icon: "simple-icons:react" },
        { name: "Next.Js", icon: "simple-icons:nextdotjs" },
        { name: "Svelte", icon: "simple-icons:svelte" },
        { name: "SvelteKit", icon: "simple-icons:svelte" },
        { name: "Tailwindcss", icon: "simple-icons:tailwindcss" },
        { name: "Git", icon: "simple-icons:git" },
        { name: "Github", icon: "simple-icons:github" },
        { name: "CI/CD Github Actions", icon: "simple-icons:githubactions" },
        { name: "Docker", icon: "simple-icons:docker" },
        { name: "VPS", icon: "simple-icons:linux" },
        { name: "Ubuntu Server", icon: "simple-icons:ubuntu" },
        { name: "Nginx", icon: "simple-icons:nginx" },
        { name: "Figma", icon: "simple-icons:figma" },
        { name: "MySQL", icon: "simple-icons:mysql" },
        { name: "PostgreSQL", icon: "simple-icons:postgresql" },
        { name: "Prisma", icon: "simple-icons:prisma" },
        { name: "Drizzle", icon: "simple-icons:drizzle" }
    ];

    interface Props {
        t: SkillsTranslation;
    }

    let { t }: Props = $props();

    const items = $derived(t.items && t.items.length > 0 ? t.items : FALLBACK_SKILLS);

    const resolveIcon = (icon: string) => {
        if (icon.includes(":")) return icon;
        return `simple-icons:${icon}`;
    };
</script>

<section id="skills" class="w-full bg-white py-16 md:py-20 lg:py-28">
    <div class="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <div class="max-w-2xl">
            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                {t.title}
            </h2>
            <p class="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">
                {t.description}
            </p>
        </div>

        <div class="mt-10 flex flex-wrap gap-3 md:mt-12 md:gap-4">
            {#each items as skill (skill.name)}
                <div
                    class="inline-flex items-center gap-2.5 rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-theme-300"
                >
                    <span
                        class="flex h-6 w-6 items-center justify-center rounded-full bg-theme-100 text-theme-700"
                    >
                        <Icon icon={resolveIcon(skill.icon)} class="h-3.5 w-3.5" />
                    </span>
                    <span class="text-sm font-semibold text-theme-700">{skill.name}</span>
                </div>
            {/each}
        </div>
    </div>
</section>
