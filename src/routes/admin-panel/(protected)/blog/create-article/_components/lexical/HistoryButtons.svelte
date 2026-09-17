<script lang="ts">
    import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL } from "lexical";
    import { Redo2Icon, Undo2Icon } from "lucide-svelte/icons";
    import { onMount } from "svelte";

    import { getEditor, redo, undo } from "svelte-lexical";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const editor = getEditor();
    let canUndo = $state(false);
    let canRedo = $state(false);

    onMount(() => {
        const unregisterUndo = editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload: boolean) => {
                canUndo = payload;
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );
        const unregisterRedo = editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload: boolean) => {
                canRedo = payload;
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );
        return () => {
            unregisterUndo();
            unregisterRedo();
        };
    });
</script>

<button
    type="button"
    title={t.undo}
    disabled={!canUndo}
    onclick={() => undo(editor)}
    class="grid h-6 w-6 cursor-pointer place-content-center rounded-md text-gray-500 disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-50"
>
    <Undo2Icon size={16} />
</button>
<button
    type="button"
    title={t.redo}
    disabled={!canRedo}
    onclick={() => redo(editor)}
    class="grid h-6 w-6 cursor-pointer place-content-center rounded-md text-gray-500 disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-50"
>
    <Redo2Icon size={16} />
</button>
