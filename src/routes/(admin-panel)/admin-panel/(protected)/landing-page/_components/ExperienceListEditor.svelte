<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { AboutExperience } from "$lib/types/landing-page";
    import type { LandingPageAdminTranslation } from "../../../../i18n/landing-page/types";

    interface Props {
        experiences: AboutExperience[];
        onChange: (items: AboutExperience[]) => void;
        t: LandingPageAdminTranslation;
    }

    let { experiences, onChange, t }: Props = $props();

    const handleAdd = () => {
        const next = [...experiences, { role: "", company: "", period: "" }];
        onChange(next);
    };

    const handleRemove = (index: number) => {
        const next = experiences.filter((_, i) => i !== index);
        onChange(next);
    };

    const handleMoveUp = (index: number) => {
        if (index <= 0) return;
        const next = [...experiences];
        const [temp] = next.splice(index, 1);
        next.splice(index - 1, 0, temp);
        onChange(next);
    };

    const handleMoveDown = (index: number) => {
        if (index >= experiences.length - 1) return;
        const next = [...experiences];
        const [temp] = next.splice(index, 1);
        next.splice(index + 1, 0, temp);
        onChange(next);
    };

    const handleFieldChange = (index: number, field: keyof AboutExperience, val: string) => {
        const next = experiences.map((exp, i) => (i === index ? { ...exp, [field]: val } : exp));
        onChange(next);
    };
</script>

<div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-700">
            {t.experiences} ({experiences.length})
        </span>
        <button
            type="button"
            onclick={handleAdd}
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-theme-50 px-3 py-1.5 text-xs font-semibold text-theme-700 transition-colors hover:bg-theme-100"
        >
            <Icon icon="lucide:plus" class="h-3.5 w-3.5" />
            <span>{t.addExperience}</span>
        </button>
    </div>

    {#if experiences.length === 0}
        <div
            class="rounded-md border border-dashed border-gray-300 p-6 text-center text-xs text-gray-400"
        >
            No work experiences added yet. Click "{t.addExperience}" to add one.
        </div>
    {:else}
        <div class="flex flex-col gap-3">
            {#each experiences as exp, index (index)}
                <div
                    class="rounded-md border border-gray-200 bg-gray-50/60 p-4 transition-colors hover:border-gray-300"
                >
                    <div
                        class="mb-3 flex items-center justify-between border-b border-gray-200 pb-2"
                    >
                        <span class="text-xs font-semibold text-gray-700">
                            #{index + 1}
                        </span>
                        <div class="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={index === 0}
                                onclick={() => handleMoveUp(index)}
                                aria-label={t.moveUp}
                                class="cursor-pointer rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <Icon icon="lucide:arrow-up" class="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                disabled={index === experiences.length - 1}
                                onclick={() => handleMoveDown(index)}
                                aria-label={t.moveDown}
                                class="cursor-pointer rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <Icon icon="lucide:arrow-down" class="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                onclick={() => handleRemove(index)}
                                aria-label={t.removeExperience}
                                class="cursor-pointer rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                                <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <label
                                for={`exp-role-${index}`}
                                class="block text-[13px] font-medium text-gray-700"
                            >
                                {t.role}
                            </label>
                            <input
                                id={`exp-role-${index}`}
                                type="text"
                                value={exp.role}
                                oninput={(e) =>
                                    handleFieldChange(index, "role", e.currentTarget.value)}
                                placeholder="e.g. Senior Backend Engineer"
                                class="mt-1 block h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label
                                for={`exp-company-${index}`}
                                class="block text-[13px] font-medium text-gray-700"
                            >
                                {t.company}
                            </label>
                            <input
                                id={`exp-company-${index}`}
                                type="text"
                                value={exp.company}
                                oninput={(e) =>
                                    handleFieldChange(index, "company", e.currentTarget.value)}
                                placeholder="e.g. Somactech"
                                class="mt-1 block h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label
                                for={`exp-period-${index}`}
                                class="block text-[13px] font-medium text-gray-700"
                            >
                                {t.period}
                            </label>
                            <input
                                id={`exp-period-${index}`}
                                type="text"
                                value={exp.period}
                                oninput={(e) =>
                                    handleFieldChange(index, "period", e.currentTarget.value)}
                                placeholder="e.g. September 2025 - Present"
                                class="mt-1 block h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
