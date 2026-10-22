import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        server: {
            port: env.PORT ? Number(env.PORT) : 5173
        },
        preview: {
            port: env.PORT ? Number(env.PORT) : 5173
        },
        plugins: [
            tailwindcss(),
            sveltekit({
                compilerOptions: {
                    // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
                    runes: ({ filename }) =>
                        filename.split(/[/\\]/).includes("node_modules") ? undefined : true
                },

                // adapter-node menghasilkan standalone Node.js server di build/index.js
                // Cocok untuk deploy di VPS/Docker.
                adapter: adapter()
            })
        ]
    };
});
