<script>
    import { format, parseISO, isValid } from "date-fns";

    export let task;
    export let onEdit;
    export let onDelete;
    export let onExportICS;
    export let onShare;
    export let onDragStart;

    function fmt(dateString) {
        if (!dateString) return "-";
        try {
            const d = parseISO(dateString);
            if (!isValid(d)) return dateString;
            return format(d, "d. MMM yyyy, HH:mm");
        } catch {
            return dateString;
        }
    }

    $: isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
</script>

<div
    role="listitem"
    data-id={task.id}
    class="card p-3 cursor-move border {isOverdue ? 'border-red-300' : 'border-transparent'}"
    draggable="true"
    ondragstart={onDragStart}
>
    <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold leading-tight">{task.title}</h3>
        {#if isOverdue}
            <span class="badge badge-danger" aria-label="This task is overdue">Overdue</span>
        {/if}
    </div>
    <p class="text-sm mt-1 whitespace-pre-wrap">{task.description}</p>
    <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>Created: {fmt(task.createdAt)}</div>
        <div>Due: {fmt(task.dueDate)}</div>
        <div>SP: {task.storyPoints}</div>
        <div>Priority: {task.priority}</div>
    </div>

    <div class="mt-3 flex flex-wrap gap-2">
        <button onclick={() => onEdit(task)} class="btn btn-warning text-xs">
            Edit
        </button>
        <button onclick={() => onDelete(task.id)} class="btn btn-danger text-xs">
            Delete
        </button>
        <button onclick={() => onExportICS(task)} class="btn btn-accent text-xs">
            ICS
        </button>
        <button onclick={() => onShare(task)} class="btn btn-primary text-xs">
            Share
        </button>
    </div>
</div>