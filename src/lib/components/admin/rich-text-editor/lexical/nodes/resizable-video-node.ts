import { $applyNodeReplacement, DecoratorNode } from "lexical";
import { mount } from "svelte";

import ResizableVideoComponent from "./ResizableVideoComponent.svelte";

import type {
    DOMConversionMap,
    DOMExportOutput,
    EditorConfig,
    LexicalEditor,
    LexicalNode,
    SerializedLexicalNode,
    Spread
} from "lexical";

export const DEFAULT_VIDEO_WIDTH_PERCENT = 100;
export const MIN_VIDEO_WIDTH_PERCENT = 20;
export const DEFAULT_VIDEO_ALIGN: VideoAlign = "center";
export type VideoAlign = "left" | "center" | "right";

export interface CreateResizableVideoPayload {
    src: string;
    title?: string;
    widthPercent?: number;
    align?: VideoAlign;
    key?: string;
}

export type SerializedResizableVideoNode = Spread<
    { src: string; title: string; widthPercent: number; align: VideoAlign },
    SerializedLexicalNode
>;

export class ResizableVideoNode extends DecoratorNode<unknown> {
    __src: string;
    __title: string;
    __widthPercent: number;
    __align: VideoAlign;

    constructor(
        src: string,
        title = "",
        widthPercent = DEFAULT_VIDEO_WIDTH_PERCENT,
        align: VideoAlign = DEFAULT_VIDEO_ALIGN,
        key?: string
    ) {
        super(key);
        this.__src = src;
        this.__title = title;
        this.__widthPercent = widthPercent;
        this.__align = align;
    }

    static getType(): string {
        return "resizable-video";
    }

    static clone(node: ResizableVideoNode): ResizableVideoNode {
        return new ResizableVideoNode(
            node.__src,
            node.__title,
            node.__widthPercent,
            node.__align,
            node.__key
        );
    }

    static importJSON(serialized: SerializedResizableVideoNode): ResizableVideoNode {
        return $createResizableVideoNode({
            src: serialized.src,
            title: serialized.title,
            widthPercent: serialized.widthPercent,
            align: serialized.align
        }).updateFromJSON(serialized);
    }

    exportJSON(): SerializedResizableVideoNode {
        return {
            ...super.exportJSON(),
            src: this.__src,
            title: this.__title,
            widthPercent: this.__widthPercent,
            align: this.__align
        };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            iframe: () => ({
                conversion: (domNode: Node) => {
                    const iframe = domNode as HTMLIFrameElement;
                    if (!iframe.src) return null;
                    return {
                        node: $createResizableVideoNode({
                            src: iframe.src,
                            title: iframe.title || ""
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
        figure.style.margin = "1.5rem 0";
        const box = document.createElement("div");
        box.style.cssText = `display:inline-block;width:${this.__widthPercent}%;max-width:100%;aspect-ratio:16/9;position:relative;border-radius:0.5rem;overflow:hidden;background-color:#000;`;
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.__src);
        iframe.setAttribute("width", "560");
        iframe.setAttribute("height", "315");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "true");
        iframe.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;border:0;";
        box.appendChild(iframe);
        figure.appendChild(box);
        return { element: figure };
    }

    getSrc(): string {
        return this.__src;
    }
    setSrc(src: string): void {
        this.getWritable().__src = src;
    }
    getTitle(): string {
        return this.__title;
    }
    setTitle(title: string): void {
        this.getWritable().__title = title;
    }
    getWidthPercent(): number {
        return this.__widthPercent;
    }
    setWidthPercent(widthPercent: number): void {
        const writable = this.getWritable();
        writable.__widthPercent = Math.min(100, Math.max(MIN_VIDEO_WIDTH_PERCENT, widthPercent));
    }
    getAlign(): VideoAlign {
        return this.__align;
    }
    setAlign(align: VideoAlign): void {
        this.getWritable().__align = align;
    }

    createDOM(_config: EditorConfig, editor: LexicalEditor): HTMLElement {
        const wrapper = document.createElement("div");
        mount(ResizableVideoComponent, {
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

export function $createResizableVideoNode(
    payload: CreateResizableVideoPayload
): ResizableVideoNode {
    return $applyNodeReplacement(
        new ResizableVideoNode(
            payload.src,
            payload.title ?? "",
            payload.widthPercent ?? DEFAULT_VIDEO_WIDTH_PERCENT,
            payload.align ?? DEFAULT_VIDEO_ALIGN,
            payload.key
        )
    );
}

export function $isResizableVideoNode(
    node: LexicalNode | null | undefined
): node is ResizableVideoNode {
    return node instanceof ResizableVideoNode;
}
