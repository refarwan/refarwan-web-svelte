import { $applyNodeReplacement, DecoratorNode } from "lexical";
import { mount } from "svelte";

import ResizableSlideShowComponent from "./ResizableSlideShowComponent.svelte";

import type {
    DOMConversionMap,
    DOMExportOutput,
    EditorConfig,
    LexicalEditor,
    LexicalNode,
    SerializedLexicalNode,
    Spread
} from "lexical";

export const DEFAULT_SLIDESHOW_WIDTH_PERCENT = 100;
export const MIN_SLIDESHOW_WIDTH_PERCENT = 20;
export const DEFAULT_SLIDESHOW_ALIGN: SlideShowAlign = "center";
export type SlideShowAlign = "left" | "center" | "right";

export interface SlideShowImage {
    id?: string;
    src: string;
    altText?: string;
}

export interface CreateResizableSlideShowPayload {
    items: SlideShowImage[];
    widthPercent?: number;
    align?: SlideShowAlign;
    key?: string;
}

export type SerializedResizableSlideShowNode = Spread<
    { items: SlideShowImage[]; widthPercent: number; align: SlideShowAlign },
    SerializedLexicalNode
>;

export class ResizableSlideShowNode extends DecoratorNode<unknown> {
    __items: SlideShowImage[];
    __widthPercent: number;
    __align: SlideShowAlign;

    constructor(
        items: SlideShowImage[] = [],
        widthPercent = DEFAULT_SLIDESHOW_WIDTH_PERCENT,
        align: SlideShowAlign = DEFAULT_SLIDESHOW_ALIGN,
        key?: string
    ) {
        super(key);
        this.__items = items;
        this.__widthPercent = widthPercent;
        this.__align = align;
    }

    static getType(): string {
        return "resizable-slideshow";
    }

    static clone(node: ResizableSlideShowNode): ResizableSlideShowNode {
        return new ResizableSlideShowNode(
            [...node.__items],
            node.__widthPercent,
            node.__align,
            node.__key
        );
    }

    static importJSON(serialized: SerializedResizableSlideShowNode): ResizableSlideShowNode {
        return $createResizableSlideShowNode({
            items: serialized.items,
            widthPercent: serialized.widthPercent,
            align: serialized.align
        }).updateFromJSON(serialized);
    }

    exportJSON(): SerializedResizableSlideShowNode {
        return {
            ...super.exportJSON(),
            items: this.__items,
            widthPercent: this.__widthPercent,
            align: this.__align
        };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            figure: (domNode: Node) => {
                const el = domNode as HTMLElement;
                if (!el.getAttribute("data-slideshow")) return null;
                try {
                    const items = JSON.parse(
                        el.getAttribute("data-slideshow") || "[]"
                    ) as SlideShowImage[];
                    return {
                        conversion: () => ({
                            node: $createResizableSlideShowNode({ items })
                        }),
                        priority: 1
                    };
                } catch {
                    return null;
                }
            }
        };
    }

    exportDOM(): DOMExportOutput {
        const figure = document.createElement("figure");
        figure.className = "article-slideshow";
        figure.style.textAlign = this.__align;
        figure.style.margin = "1.5rem 0";
        figure.setAttribute("data-slideshow", JSON.stringify(this.__items));

        const container = document.createElement("div");
        container.style.cssText = `display:inline-block;width:${this.__widthPercent}%;max-width:100%;aspect-ratio:16/9;position:relative;border-radius:0.5rem;overflow:hidden;background-color:#0f172a;`;

        if (this.__items[0]) {
            const img = document.createElement("img");
            img.src = this.__items[0].src;
            img.alt = this.__items[0].altText || "Slide image";
            img.style.cssText = "width:100%;height:100%;object-fit:contain;";
            container.appendChild(img);
        }

        figure.appendChild(container);
        return { element: figure };
    }

    getItems(): SlideShowImage[] {
        return this.__items;
    }
    setItems(items: SlideShowImage[]): void {
        this.getWritable().__items = items;
    }
    getWidthPercent(): number {
        return this.__widthPercent;
    }
    setWidthPercent(widthPercent: number): void {
        const writable = this.getWritable();
        writable.__widthPercent = Math.min(
            100,
            Math.max(MIN_SLIDESHOW_WIDTH_PERCENT, widthPercent)
        );
    }
    getAlign(): SlideShowAlign {
        return this.__align;
    }
    setAlign(align: SlideShowAlign): void {
        this.getWritable().__align = align;
    }

    createDOM(_config: EditorConfig, editor: LexicalEditor): HTMLElement {
        const wrapper = document.createElement("div");
        mount(ResizableSlideShowComponent, {
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

export function $createResizableSlideShowNode(
    payload: CreateResizableSlideShowPayload
): ResizableSlideShowNode {
    return $applyNodeReplacement(
        new ResizableSlideShowNode(
            payload.items,
            payload.widthPercent ?? DEFAULT_SLIDESHOW_WIDTH_PERCENT,
            payload.align ?? DEFAULT_SLIDESHOW_ALIGN,
            payload.key
        )
    );
}

export function $isResizableSlideShowNode(
    node: LexicalNode | null | undefined
): node is ResizableSlideShowNode {
    return node instanceof ResizableSlideShowNode;
}
