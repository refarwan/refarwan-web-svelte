<script lang="ts">
    import {
        siCss,
        siDocker,
        siExpress,
        siFigma,
        siGit,
        siGithub,
        siHtml5,
        siJavascript,
        siLinux,
        siMysql,
        siNextdotjs,
        siNginx,
        siNodedotjs,
        siPostgresql,
        siPrisma,
        siReact,
        siTailwindcss,
        siTypescript,
        siUbuntu
    } from "simple-icons";

    import type { SkillsTranslation } from "$lib/i18n/home";

    interface SkillItem {
        name: string;
        icon: { title: string; path: string };
    }

    const SKILLS: SkillItem[] = [
        { name: "HTML", icon: siHtml5 },
        { name: "CSS", icon: siCss },
        { name: "JavaScript", icon: siJavascript },
        { name: "TypeScript", icon: siTypescript },
        { name: "Node.Js", icon: siNodedotjs },
        { name: "Express.Js", icon: siExpress },
        { name: "React.Js", icon: siReact },
        { name: "Next.Js", icon: siNextdotjs },
        { name: "Tailwindcss", icon: siTailwindcss },
        { name: "Git", icon: siGit },
        { name: "Github", icon: siGithub },
        { name: "Docker", icon: siDocker },
        { name: "VPS", icon: siLinux },
        { name: "Ubuntu Server", icon: siUbuntu },
        { name: "Nginx", icon: siNginx },
        { name: "Figma", icon: siFigma },
        { name: "MySQL", icon: siMysql },
        { name: "PostgreSQL", icon: siPostgresql },
        { name: "Prisma", icon: siPrisma }
    ];

    interface Props {
        t: SkillsTranslation;
    }

    let { t }: Props = $props();
</script>

<section id="skills" class="w-full bg-white py-16 md:py-20 lg:py-28">
    <div class="mx-auto max-w-320 px-5 md:px-10 lg:px-16">
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
                    class="inline-flex items-center gap-2.5 rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-theme-300 hover:shadow-sm"
                >
                    <span
                        class="flex h-6 w-6 items-center justify-center rounded-full bg-theme-100 text-theme-700"
                    >
                        <svg
                            role="img"
                            viewBox="0 0 24 24"
                            class="h-3.5 w-3.5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>{skill.icon.title}</title>
                            <path d={skill.icon.path} />
                        </svg>
                    </span>
                    <span class="text-sm font-semibold text-theme-700">{skill.name}</span>
                </div>
            {/each}
        </div>
    </div>
</section>
