import { enUS } from "./en-US";
import { idID } from "./id-ID";
import { jaJP } from "./ja-JP";

import type { ContentLocale } from "../types";
import type { HomeTranslation } from "./types";

export type {
    AboutExperience,
    AboutTranslation,
    CtaTranslation,
    HeroTranslation,
    HomeTranslation,
    ProjectItem,
    ProjectsTranslation,
    SkillsTranslation
} from "./types";

export const HOME_TRANSLATIONS: Record<ContentLocale, HomeTranslation> = {
    "en-US": enUS,
    "id-ID": idID,
    "ja-JP": jaJP
};
