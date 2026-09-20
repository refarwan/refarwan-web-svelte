<script lang="ts">
    interface Props {
        contentHTML: string;
    }

    let { contentHTML }: Props = $props();
</script>

<div class="project-body leading-relaxed text-gray-700">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html contentHTML}
</div>

<style>
    :global(.project-body) {
        font-size: 1.0625rem;
        line-height: 1.75;
        color: #374151;
        word-break: break-word;
    }

    :global(.project-body > *:first-child) {
        margin-top: 0;
    }

    :global(.project-body > *:last-child) {
        margin-bottom: 0;
    }

    :global(.project-body p) {
        margin-bottom: 1.25rem;
    }

    :global(.project-body h1) {
        font-size: 1.875rem;
        font-weight: 700;
        color: #111827;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        line-height: 1.3;
        letter-spacing: -0.02em;
    }

    :global(.project-body h2) {
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
        margin-top: 1.75rem;
        margin-bottom: 0.625rem;
        line-height: 1.35;
        letter-spacing: -0.015em;
    }

    :global(.project-body h3) {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        line-height: 1.4;
    }

    :global(.project-body h4),
    :global(.project-body h5),
    :global(.project-body h6) {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }

    :global(.project-body a) {
        color: var(--color-theme-600, #0284c7);
        text-decoration: underline;
        text-underline-offset: 3px;
        font-weight: 500;
        transition: color 0.15s ease;
    }

    :global(.project-body a:hover) {
        color: var(--color-theme-700, #0369a1);
    }

    :global(.project-body blockquote) {
        border-left: 4px solid var(--color-theme-600, #0284c7);
        background-color: var(--color-theme-50, #f0f9ff);
        color: #334155;
        font-style: italic;
        padding: 1rem 1.25rem;
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        margin: 1.75rem 0;
    }

    :global(.project-body blockquote p:last-child) {
        margin-bottom: 0;
    }

    :global(.project-body pre) {
        background-color: #0d1527;
        color: #e2e8f0;
        padding: 1.25rem 1.5rem;
        border-radius: 0.75rem;
        overflow-x: auto;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.875rem;
        line-height: 1.7;
        margin: 1.75rem 0;
        border: 1px solid #1e293b;
    }

    :global(.project-body code:not(pre code)) {
        background-color: #f1f5f9;
        color: var(--color-theme-600, #0284c7);
        padding: 0.15rem 0.4rem;
        border-radius: 0.25rem;
        font-size: 0.875em;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 500;
    }

    :global(.project-body ul) {
        list-style-type: disc;
        margin: 1.25rem 0;
        padding-left: 1.75rem;
    }

    :global(.project-body ol) {
        list-style-type: decimal;
        margin: 1.25rem 0;
        padding-left: 1.75rem;
    }

    :global(.project-body li) {
        margin-bottom: 0.5rem;
        line-height: 1.75;
    }

    :global(.project-body img) {
        max-width: 100%;
        height: auto;
        border-radius: 0.75rem;
        margin: 2rem auto;
        display: block;
    }

    :global(.project-body table) {
        border-collapse: collapse;
        margin: 2rem 0;
        width: max-content;
        max-width: 100%;
        font-size: 0.9375rem;
        overflow-x: auto;
        display: block;
    }

    :global(.project-body table.SL_Theme__tableAlignmentCenter) {
        margin-left: auto !important;
        margin-right: auto !important;
    }

    :global(.project-body table.SL_Theme__tableAlignmentRight) {
        margin-left: auto !important;
        margin-right: 0 !important;
    }

    :global(.project-body th) {
        background-color: #f8fafc;
        font-weight: 600;
        text-align: left;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        color: #1e293b;
    }

    :global(.project-body td) {
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        color: #475569;
        background-color: #ffffff;
    }

    :global(.project-body table.SL_Theme__tableRowStriping tr:nth-child(even)) {
        background-color: #f8fafc;
    }

    :global(.project-body hr) {
        border: none;
        border-top: 1px solid #e5e7eb;
        margin: 2.5rem 0;
    }
</style>
