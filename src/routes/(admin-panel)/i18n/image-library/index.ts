import { enUS } from "./en-US";
import { idID } from "./id-ID";

import type { AdminLocale } from "../types";
import type { ImageLibrary } from "./types";

export const IMAGE_LIBRARY_TRANSLATIONS: Record<AdminLocale, ImageLibrary> = {
    "en-US": enUS,
    "id-ID": idID
};
