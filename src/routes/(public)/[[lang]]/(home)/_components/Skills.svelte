<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { SkillsTranslation } from "$lib/i18n/home";

    interface SkillItem {
        name: string;
        icon: string;
    }

    const SKILLS: SkillItem[] = [
        { name: "HTML", icon: "html5" },
        { name: "CSS", icon: "css3" },
        { name: "JavaScript", icon: "javascript" },
        { name: "TypeScript", icon: "typescript" },
        { name: "PHP", icon: "php" },
        { name: "Node.Js", icon: "nodedotjs" },
        { name: "Bun", icon: "bun" },
        { name: "Express.Js", icon: "express" },
        { name: "NestJs", icon: "nestjs" },
        { name: "Hono", icon: "hono" },
        { name: "Laravel", icon: "laravel" },
        { name: "React.Js", icon: "react" },
        { name: "Next.Js", icon: "nextdotjs" },
        { name: "Svelte", icon: "svelte" },
        { name: "SvelteKit", icon: "svelte" },
        { name: "Tailwindcss", icon: "tailwindcss" },
        { name: "Git", icon: "git" },
        { name: "Github", icon: "github" },
        { name: "CI/CD Github Actions", icon: "githubactions" },
        { name: "Docker", icon: "docker" },
        { name: "VPS", icon: "linux" },
        { name: "Ubuntu Server", icon: "ubuntu" },
        { name: "Nginx", icon: "nginx" },
        { name: "Figma", icon: "figma" },
        { name: "MySQL", icon: "mysql" },
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "Prisma", icon: "prisma" },
        { name: "Drizzle", icon: "drizzle" }
    ];

    interface Props {
        t: SkillsTranslation;
    }

    let { t }: Props = $props();
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
            {#each SKILLS as skill (skill.name)}
                <div
                    class="inline-flex items-center gap-2.5 rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-theme-300"
                >
                    <span
                        class="flex h-6 w-6 items-center justify-center rounded-full bg-theme-100 text-theme-700"
                    >
                        <Icon icon={`simple-icons:${skill.icon}`} class="h-3.5 w-3.5" />
                    </span>
                    <span class="text-sm font-semibold text-theme-700">{skill.name}</span>
                </div>
            {/each}
        </div>
    </div>
</section>
