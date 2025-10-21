<script>
    import { format, parseISO, isValid } from "date-fns";
    import { createEventDispatcher } from 'svelte';

    export let task;
    export let onEdit;
    export let onDelete;
    export let onExportICS;
    export let onShare;
    export let onDragStart;

    const dispatch = createEventDispatcher();

    function fmt(dateString) {
        if (!dateString) return "-";
        try {
            const d = parseISO(dateString);
            if (!isValid(d)) return dateString;
            return format(d, "MMM d");
        } catch {
            return dateString;
        }
    }

    $: isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
    $: priorityColor = {
        'High': 'bg-red-100 border-red-300 text-red-800',
        'Medium': 'bg-yellow-100 border-yellow-300 text-yellow-800',
        'Low': 'bg-green-100 border-green-300 text-green-800'
    }[task.priority] || 'bg-gray-100 border-gray-300 text-gray-800';

    // Keyboard interactions are provided via explicit buttons to satisfy a11y rules
</script>

<div
    role="listitem"
    data-id={task.id}
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow {isOverdue ? 'border-red-300 bg-red-50' : ''}"
    draggable="true"
    ondragstart={onDragStart}
    aria-label={task.title + ', priority ' + task.priority + ', story points ' + task.storyPoints}
>
    <!-- Card Header -->
    <div class="flex items-start justify-between mb-3">
        <h3 class="font-semibold text-gray-900 text-sm leading-tight">{task.title}</h3>
        {#if isOverdue}
            <span class="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                Overdue
            </span>
        {/if}
    </div>

    <!-- Card Content -->
    <p class="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>

    <!-- Card Footer -->
    <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center space-x-2">
            <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
                SP: {task.storyPoints}
            </span>
            <span class="border px-2 py-1 rounded-full font-medium {priorityColor}">
                {task.priority}
            </span>
        </div>
        <div class="flex items-center space-x-1">
            <span class="text-gray-400">📅</span>
            <span>{fmt(task.dueDate)}</span>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex flex-wrap gap-2 items-center">
        <button aria-label="Move left" title="Move left" onclick={() => dispatch('moveleft', { id: task.id })} class="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium px-2 py-1.5 rounded-md transition-colors">
            ←
        </button>
        <button aria-label="Move right" title="Move right" onclick={() => dispatch('moveright', { id: task.id })} class="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium px-2 py-1.5 rounded-md transition-colors">
            →
        </button>

        <button onclick={() => onEdit(task)} class="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
            Edit
        </button>
        <button onclick={() => onDelete(task.id)} class="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
            Delete
        </button>
        <button onclick={() => onExportICS(task)} class="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
            ICS
        </button>
        <button onclick={() => onShare(task)} class="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
            Share
        </button>
    </div>
</div>