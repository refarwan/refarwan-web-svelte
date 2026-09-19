import { $applyNodeReplacement, DecoratorNode } from "lexical";
import { mount } from "svelte";
import ResizableImageComponent from "./ResizableImageComponent.svelte";

import type {
    DOMConversionMap,
    DOMExportOutput,
    EditorConfig,
    LexicalEditor,
    LexicalNode,
    SerializedLexicalNode,
    Spread
} from "lexical";

export const DEFAULT_IMAGE_WIDTH_PERCENT = 100;
export const MIN_IMAGE_WIDTH_PERCENT = 15;
export const DEFAULT_IMAGE_ALIGN: ImageAlign = "center";
export type ImageAlign = "left" | "center" | "right";

export interface CreateResizableImagePayload {
    src: string;
    altText?: string;
    widthPercent?: number;
    align?: ImageAlign;
    key?: string;
}

export type SerializedResizableImageNode = Spread<
    { src: string; altText: string; widthPercent: number; align: ImageAlign },
    SerializedLexicalNode
>;

export class ResizableImageNode extends DecoratorNode<unknown> {
    __src: string;
    __altText: string;
    __widthPercent: number;
    __align: ImageAlign;

    constructor(
        src: string,
        altText = "",
        widthPercent = DEFAULT_IMAGE_WIDTH_PERCENT,
        align: ImageAlign = DEFAULT_IMAGE_ALIGN,
        key?: string
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__widthPercent = widthPercent;
        this.__align = align;
    }

    static getType(): string {
        return "resizable-image";
    }

    static clone(node: ResizableImageNode): ResizableImageNode {
        return new ResizableImageNode(
            node.__src,
            node.__altText,
            node.__widthPercent,
            node.__align,
            node.__key
        );
    }

    static importJSON(serialized: SerializedResizableImageNode): ResizableImageNode {
        return $createResizableImageNode({
            src: serialized.src,
            altText: serialized.altText,
            widthPercent: serialized.widthPercent,
            align: serialized.align
        }).updateFromJSON(serialized);
    }

    exportJSON(): SerializedResizableImageNode {
        return {
            ...super.exportJSON(),
            src: this.__src,
            altText: this.__altText,
            widthPercent: this.__widthPercent,
            align: this.__align
        };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: () => ({
                conversion: (domNode: Node) => {
                    const img = domNode as HTMLImageElement;
                    if (!img.src) return null;
                    return {
                        node: $createResizableImageNode({
                            src: img.src,
                            altText: img.alt || ""
                        })
                    };
                },
                priority: 0
            })
        };
    }

    exportDOM(): DOMExportOutput {
        const figure = document.createElement("figure");
        figure.style.textAlign = this.__align;
        figure.style.margin = "1rem 0";
        const img = document.createElement("img");
        img.setAttribute("src", this.__src);
        img.setAttribute("alt", this.__altText);
        img.style.width = `${this.__widthPercent}%`;
        img.style.height = "auto";
        img.style.maxWidth = "100%";
        img.style.borderRadius = "0.375rem";
        img.style.display = "inline-block";
        figure.appendChild(img);
        return { element: figure };
    }

    getSrc(): string {
        return this.__src;
    }
    setSrc(src: string): void {
        this.getWritable().__src = src;
    }
    getAltText(): string {
        return this.__altText;
    }
    setAltText(altText: string): void {
        this.getWritable().__altText = altText;
    }
    getWidthPercent(): number {
        return this.__widthPercent;
    }
    setWidthPercent(widthPercent: number): void {
        const writable = this.getWritable();
        writable.__widthPercent = Math.min(100, Math.max(MIN_IMAGE_WIDTH_PERCENT, widthPercent));
    }
    getAlign(): ImageAlign {
        return this.__align;
    }
    setAlign(align: ImageAlign): void {
        this.getWritable().__align = align;
    }

    createDOM(_config: EditorConfig, editor: LexicalEditor): HTMLElement {
        const wrapper = document.createElement("div");
        mount(ResizableImageComponent, {
            target: wrapper,
            props: { nodeKey: this.__key, editor }
        });
        return wrapper;
    }

    updateDOM(): boolean {
        return false;
    }
    getTextContent(): string {
        return "\n";
    }
    isInline(): false {
        return false;
    }
    decorate(): null {
        return null;
    }
}

export function $createResizableImageNode(
    payload: CreateResizableImagePayload
): ResizableImageNode {
    return $applyNodeReplacement(
        new ResizableImageNode(
            payload.src,
            payload.altText ?? "",
            payload.widthPercent ?? DEFAULT_IMAGE_WIDTH_PERCENT,
            payload.align ?? DEFAULT_IMAGE_ALIGN,
            payload.key
        )
    );
}

export function $isResizableImageNode(
    node: LexicalNode | null | undefined
): node is ResizableImageNode {
    return node instanceof ResizableImageNode;
}
