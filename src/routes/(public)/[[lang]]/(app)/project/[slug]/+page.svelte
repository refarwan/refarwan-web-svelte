<script lang="ts">
    import { resolve } from "$app/paths";
    import { PROJECT_TRANSLATIONS } from "$lib/i18n/project";
    import AppMainSection from "../../_components/AppMainSection.svelte";
    import ProjectBody from "./_components/ProjectBody.svelte";
    import ProjectBreadcrumbs from "./_components/ProjectBreadcrumbs.svelte";
    import ProjectHeader from "./_components/ProjectHeader.svelte";
    import ProjectHeroCover from "./_components/ProjectHeroCover.svelte";
    import ProjectLinks from "./_components/ProjectLinks.svelte";
    import ProjectTechStack from "./_components/ProjectTechStack.svelte";
    import RelatedProjectsSection from "./_components/RelatedProjectsSection.svelte";

    import type { ResolvedPathname } from "$app/types";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(PROJECT_TRANSLATIONS[currentLang]);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/project`);
    const homeHref: ResolvedPathname = $derived(resolve(basePath as `/${string}`));

    const categoryHref: ResolvedPathname | undefined = $derived(
        data.project.categorySlug
            ? resolve(`${basePath}?category=${data.project.categorySlug}` as `/${string}`)
            : undefined
    );
</script>

<svelte:head>
    <title>{`${data.project.title ?? "Untitled"} | ${data.metadata.title} ${t.pageTitle}`}</title>
    <meta
        name="description"
        content={data.project.shortDescription || data.project.title || t.pageDescription}
    />
    <meta
        property="og:title"
        content={`${data.project.title ?? "Untitled"} | ${data.metadata.title} ${t.pageTitle}`}
    />
    <meta
        property="og:description"
        content={data.project.shortDescription || data.project.title || t.pageDescription}
    />
    <meta property="og:type" content="website" />
    {#if data.project.thumbnail?.large || data.project.thumbnail?.medium}
        <meta
            property="og:image"
            content={data.project.thumbnail.large || data.project.thumbnail.medium}
        />
    {/if}
</svelte:head>

<AppMainSection>
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-5 md:gap-7">
        <ProjectBreadcrumbs
            {homeHref}
            homeLabel={t.homeBreadcrumb}
            projectTitle={data.project.title ?? ""}
        />

        <ProjectHeader
            title={data.project.title ?? "Untitled"}
            createdAt={data.project.createdAt}
            category={data.project.category}
            {categoryHref}
            lang={currentLang}
        />

        <ProjectHeroCover thumbnail={data.project.thumbnail} title={data.project.title ?? ""} />

        <ProjectLinks
            githubLink={data.project.githubLink}
            gitlabLink={data.project.gitlabLink}
            demoLink={data.project.demoLink}
            githubLabel={t.githubLabel}
            gitlabLabel={t.gitlabLabel}
            demoLabel={t.demoLabel}
        />

        <ProjectTechStack techIcons={data.project.techIcons} techLabel={t.techLabel} />

        <ProjectBody contentHTML={data.project.contentHTML} />
    </div>

    <RelatedProjectsSection
        heading={t.relatedProjectsHeading}
        subheading={t.relatedProjectsSubheading}
        projects={data.relatedProjects}
        {basePath}
        viewProjectLabel={t.viewProject}
        lang={currentLang}
    />
</AppMainSection>
