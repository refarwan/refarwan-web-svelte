<script lang="ts">
    import { popup } from "$lib/stores/popup.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";

    import AddLanguageModal from "./_components/AddLanguageModal.svelte";
    import AdminLanguageSection from "./_components/AdminLanguageSection.svelte";
    import ColorPickerModal from "./_components/ColorPickerModal.svelte";
    import LanguagesFormSection from "./_components/LanguagesFormSection.svelte";
    import MetadataFormSection from "./_components/MetadataFormSection.svelte";
    import SettingsSkeleton from "./_components/SettingsSkeleton.svelte";
    import ThemeFormSection from "./_components/ThemeFormSection.svelte";
    import { useSettingsForm } from "./use-settings-form.svelte";
    import { CONTENT_LANGUAGES } from "$lib/constants";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT.settings);
    });

    const form = useSettingsForm(
        () => t,
        () => commonT
    );

    let colorPickerPopupId = $state("");
    let addLanguagePopupId = $state("");

    const openColorPicker = () => {
        colorPickerPopupId = popup.generateId();
        popup.custom({ id: colorPickerPopupId, component: colorPickerSnippet });
    };

    const openAddLanguageModal = () => {
        addLanguagePopupId = popup.generateId();
        popup.custom({ id: addLanguagePopupId, component: addLanguageSnippet });
    };
</script>

<div class="flex flex-col gap-4">
    {#if form.loading}
        <SettingsSkeleton />
    {:else if form.loadError}
        <div class="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {form.loadError}
        </div>
    {:else}
        <form
            onsubmit={form.handleSubmit}
            enctype="multipart/form-data"
            class="flex flex-col gap-4"
        >
            <MetadataFormSection
                {t}
                bind:title={form.title}
                bind:description={form.description}
                bind:faviconPreview={form.faviconPreview}
                bind:faviconFile={form.faviconFile}
            />

            <ThemeFormSection
                {t}
                themeShades={form.themeShades}
                isThemeChanged={form.isThemeChanged}
                selectedColor={form.selectedColor}
                resetting={form.resetting}
                onOpenColorPicker={openColorPicker}
                onResetTheme={form.handleResetTheme}
            />

            <LanguagesFormSection
                {t}
                otherContentLanguages={form.otherContentLanguages}
                availableLanguages={form.availableLanguages}
                activeLanguages={form.activeLanguages}
                onRemoveLanguage={form.onRemoveLanguage}
                onOpenAddLanguageModal={openAddLanguageModal}
            />

            <div class="flex justify-end">
                <button
                    type="submit"
                    disabled={form.submitting || !form.isDirty}
                    class="rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-theme-700 disabled:opacity-50"
                >
                    {form.submitting ? t.saving : t.save}
                </button>
            </div>
        </form>
    {/if}

    <AdminLanguageSection {t} initialLang={data.adminLang} />
</div>

{#snippet colorPickerSnippet()}
    <ColorPickerModal
        initialColor={form.selectedColor}
        onClose={() => popup.remove(colorPickerPopupId)}
        onSelectColor={form.onColorChange}
        title={t.pickColor}
        shadesPreviewLabel={t.shadesPreview}
        cancelLabel={commonT.cancel}
        applyLabel={t.applyColor}
    />
{/snippet}

{#snippet addLanguageSnippet()}
    <AddLanguageModal
        activeCodes={CONTENT_LANGUAGES.filter((lang) =>
            lang.code === "en" ? true : form.otherContentLanguages.includes(lang.locale)
        ).map((lang) => lang.code)}
        onClose={() => popup.remove(addLanguagePopupId)}
        onAddLanguage={form.onAddLanguage}
        title={t.addLanguageModalTitle}
        searchPlaceholder={t.addLanguagePlaceholder}
        defaultLabel={t.defaultLanguage}
        activeLabel={t.activeLanguage}
        addLabel={t.addLanguageAction}
        doneLabel={t.done}
        closeLabel={t.closeModal}
    />
{/snippet}
