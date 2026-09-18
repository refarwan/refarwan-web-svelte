<script lang="ts">
    import { getEditor } from "svelte-lexical";

    import { getActiveTableDetails } from "./table-commands";
    import TableCellResizer from "./TableCellResizer.svelte";
    import TableFloatingToolbar from "./TableFloatingToolbar.svelte";
    import TableKeyboardNav from "./TableKeyboardNav.svelte";

    import type { ActiveTableDetails } from "./table-commands";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const editor = getEditor();

    let activeDetails = $state<ActiveTableDetails | null>(null);
    let menuX = $state(0);
    let menuY = $state(0);
    let menuVisible = $state(false);

    const closeMenu = () => {
        menuVisible = false;
        activeDetails = null;
    };

    // Listen for right-click on the editor root element
    $effect(() => {
        const unregister = editor.registerRootListener((rootElement, prevRootElement) => {
            const handleContextMenu = (e: MouseEvent) => {
                // Check if we're inside a table
                let node: Node | null = e.target as Node;
                let inTable = false;
                while (node) {
                    if ((node as HTMLElement).nodeName === "TABLE") {
                        inTable = true;
                        break;
                    }
                    node = node.parentNode;
                }

                if (!inTable) {
                    closeMenu();
                    return;
                }

                e.preventDefault(); // block native context menu
                const details = getActiveTableDetails(editor);
                if (!details) {
                    closeMenu();
                    return;
                }

                activeDetails = details;
                // Position with small offset so it doesn't cover the cursor
                menuX = e.clientX + 4;
                menuY = e.clientY + 4;
                menuVisible = true;
            };

            if (prevRootElement) {
                prevRootElement.removeEventListener("contextmenu", handleContextMenu);
            }
            if (rootElement) {
                rootElement.addEventListener("contextmenu", handleContextMenu);
            }
        });
        return unregister;
    });
</script>

<svelte:window
    onclick={() => {
        if (!menuVisible) return;
        menuVisible = false;
        activeDetails = null;
    }}
    onkeydown={(e) => {
        if (e.key === "Escape") closeMenu();
    }}
/>

{#if menuVisible && activeDetails}
    <TableFloatingToolbar
        {editor}
        details={activeDetails}
        {menuX}
        {menuY}
        onClose={closeMenu}
        {t}
    />
{/if}

<TableCellResizer {editor} />
<TableKeyboardNav {editor} />
