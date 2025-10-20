<script>
    import { format, parseISO, isValid } from "date-fns";

    export let task;
    export let onEdit;
    export let onDelete;
    export let onExportICS;
    export let onShare;

    // Helpers: date formatting
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

    // Check if task is overdue
    $: isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
</script>

<div
    role="listitem"
    data-id={task.id}
    class="bg-white p-2 rounded shadow cursor-move {isOverdue ? 'border-2 border-red-500' : ''}"
    draggable="true"
>
    <h3 class="font-semibold">{task.title}</h3>
    <p class="text-sm">{task.description}</p>
    <p class="text-xs text-gray-500">Created: {task.createdAt ? fmt(task.createdAt) : "-"}</p>
    <p class="text-xs text-gray-500">Due: {task.dueDate ? fmt(task.dueDate) : "-"}</p>
    <p class="text-xs text-gray-500">SP: {task.storyPoints} | Priority: {task.priority}</p>
    
    {#if isOverdue}
        <div class="mt-1">
            <span class="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full" 
                  aria-label="This task is overdue">
                ⚠️ Overdue
            </span>
        </div>
    {/if}

    <div class="mt-2 flex flex-wrap gap-2">
        <button 
            onclick={() => onEdit(task)} 
            class="px-2 py-1 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500"
        >
            Edit
        </button>
        <button 
            onclick={() => onDelete(task.id)} 
            class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
            Delete
        </button>
        <button 
            onclick={() => onExportICS(task)} 
            class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        >
            ICS
        </button>
        <button 
            onclick={() => onShare(task)} 
            class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Share
        </button>
    </div>
</div>
