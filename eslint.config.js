import prettier from "eslint-config-prettier";
import path from "node:path";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

export default defineConfig(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ts.configs.recommended,
    svelte.configs.recommended,
    prettier,
    svelte.configs.prettier,
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
            // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
            "no-undef": "off"
        }
    },
    {
        files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser
            }
        }
    },
    {
        // Nav items mix same-page fragments (#about, #skills, ...) with a manually
        // locale-prefixed /watch path, so resolve() can't type-check every href here.
        files: ["src/routes/\\[\\[lang=lang\\]\\]/(home)/_components/HomeNavigation.svelte"],
        rules: {
            "svelte/no-navigation-without-resolve": "off"
        }
    },
    {
        // homeHref/contactHref/cancelHref are pre-resolved (via resolve()) by the caller
        // and passed in as plain string props, so resolve() can't be called directly on
        // these hrefs.
        files: [
            "src/lib/components/NotFoundContent.svelte",
            "src/routes/admin-panel/(protected)/watch/upload/_components/WatchCreateActions.svelte",
            "src/lib/components/video-player/PlayerTopBar.svelte",
            "src/routes/admin-panel/(protected)/watch/videos/_components/VideoDetailModal.svelte"
        ],
        rules: {
            "svelte/no-navigation-without-resolve": "off"
        }
    },
    {
        // Pagination/search links append a dynamic query string onto a resolve()'d base
        // path, so resolve() can't type-check the final href/goto() target here.
        files: [
            "src/lib/components/Pagination.svelte",
            "src/routes/\\[\\[lang=lang\\]\\]/watch/+page.svelte",
            "src/routes/\\[\\[lang=lang\\]\\]/watch/_components/VideoCard.svelte",
            "src/routes/\\[\\[lang=lang\\]\\]/watch/_components/WatchCategoryFilter.svelte",
            "src/routes/\\[\\[lang=lang\\]\\]/watch/play/_components/PlayRecommendedVideos.svelte",
            "src/routes/\\[\\[lang=lang\\]\\]/watch/play/_components/PlayVideoInfo.svelte",
            "src/routes/\\[\\[lang=lang\\]\\]/watch/_components/AppHeader.svelte",
            "src/routes/\\[\\[lang=lang\\]\\]/watch/_components/AppsDropdown.svelte",
            "src/routes/\\[\\[lang=lang\\]\\]/watch/_components/Searchbar.svelte"
        ],
        rules: {
            "svelte/no-navigation-without-resolve": "off"
        }
    }
);
