import type { ImageSource } from "./setting";

export interface ImageLibraryItem {
    id: string;
    uploaderId: string;
    smallPath: string;
    mediumPath: string;
    largePath: string;
    createdAt: string;
    source: ImageSource;
}
