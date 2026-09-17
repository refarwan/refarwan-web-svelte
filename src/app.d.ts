// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { ContentLanguage } from "$lib/types";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            lang: string;
            locale: string;
            contentLanguages: ContentLanguage[];
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
