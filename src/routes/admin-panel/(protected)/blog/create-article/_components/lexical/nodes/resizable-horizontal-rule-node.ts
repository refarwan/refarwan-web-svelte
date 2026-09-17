import { $applyNodeReplacement, DecoratorNode } from "lexical";
import { mount } from "svelte";

import ResizableHorizontalRuleComponent from "./ResizableHorizontalRuleComponent.svelte";

import type {
    DOMConversionMap,
    DOMExportOutput,
    EditorConfig,
    LexicalEditor,
    LexicalNode,
    SerializedLexicalNode,
    Spread
} from "lexical";

export const DEFAULT_HR_WIDTH_PERCENT = 100;
export const MIN_HR_WIDTH_PERCENT = 10;

export type SerializedResizableHorizontalRuleNode = Spread<
    { widthPercent: number },
    SerializedLexicalNode
>;

export class ResizableHorizontalRuleNode extends DecoratorNode<unknown> {
    __widthPercent: number;

    constructor(widthPercent: number = DEFAULT_HR_WIDTH_PERCENT, key?: string) {
        super(key);
        this.__widthPercent = widthPercent;
    }

    static getType(): string {
        return "resizable-horizontal-rule";
    }

    static clone(node: ResizableHorizontalRuleNode): ResizableHorizontalRuleNode {
        return new ResizableHorizontalRuleNode(node.__widthPercent, node.__key);
    }

    static importJSON(
        serializedNode: SerializedResizableHorizontalRuleNode
    ): ResizableHorizontalRuleNode {
        return $createResizableHorizontalRuleNode(serializedNode.widthPercent).updateFromJSON(
            serializedNode
        );
    }

    exportJSON(): SerializedResizableHorizontalRuleNode {
        return { ...super.exportJSON(), widthPercent: this.__widthPercent };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            hr: () => ({
                conversion: () => ({ node: $createResizableHorizontalRuleNode() }),
                priority: 0
            })
        };
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("hr");
        element.style.width = `${this.__widthPercent}%`;
        return { element };
    }

    getWidthPercent(): number {
        return this.__widthPercent;
    }

    setWidthPercent(widthPercent: number): void {
        const writable = this.getWritable();
        writable.__widthPercent = Math.min(100, Math.max(MIN_HR_WIDTH_PERCENT, widthPercent));
    }

    createDOM(_config: EditorConfig, editor: LexicalEditor): HTMLElement {
        const wrapper = document.createElement("div");
        mount(ResizableHorizontalRuleComponent, {
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

export function $createResizableHorizontalRuleNode(
    widthPercent: number = DEFAULT_HR_WIDTH_PERCENT
): ResizableHorizontalRuleNode {
    return $applyNodeReplacement(new ResizableHorizontalRuleNode(widthPercent));
}

export function $isResizableHorizontalRuleNode(
    node: LexicalNode | null | undefined
): node is ResizableHorizontalRuleNode {
    return node instanceof ResizableHorizontalRuleNode;
}
