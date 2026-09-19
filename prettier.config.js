/** @type {import("prettier").Config} */
const config = {
    useTabs: false,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "none",
    printWidth: 100,
    plugins: [
        "prettier-plugin-svelte",
        "prettier-plugin-tailwindcss",
        "@ianvs/prettier-plugin-sort-imports"
    ],
    overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
    tailwindStylesheet: "./src/routes/layout.css",
    importOrder: [
        "^\\u0000",
        "^bun(:.*)?$",
        "^node:(.*)$",
        "<THIRD_PARTY_MODULES>",
        "^\\$lib/(.*)$",
        "^@/(.*)$",
        "^[./]",
        "",
        "<TYPES>^bun(:.*)?$",
        "<TYPES>^node:(.*)$",
        "<TYPES>",
        "<TYPES>^\\$lib/(.*)$",
        "<TYPES>^[./]"
    ]
};

export default config;
