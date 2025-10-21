<script>
    export let onAddTask;
    export let onEditTask;
    export let taskToEdit = null;

    let dialogEl;
    let title = "";
    let description = "";
    let dueDate = "";
    let storyPoints = 1;
    let priority = "Medium";

    $: if (taskToEdit) {
        title = taskToEdit.title;
        description = taskToEdit.description || "";
        dueDate = taskToEdit.dueDate || "";
        storyPoints = taskToEdit.storyPoints || 1;
        priority = taskToEdit.priority || "Medium";
    } else {
        reset();
    }

    function submit() {
        const taskData = { title, description, dueDate, storyPoints, priority, lane: taskToEdit ? taskToEdit.lane : "todo" };
        if (taskToEdit) onEditTask({ ...taskToEdit, ...taskData });
        else onAddTask(taskData);
        reset();
        dialogEl.close();
    }

    function cancel() {
        dialogEl.close();
    }

    function reset() {
        title = "";
        description = "";
        dueDate = "";
        storyPoints = 1;
        priority = "Medium";
    }

    export function showDialog() {
        dialogEl.showModal();
    }
</script>

<dialog bind:this={dialogEl}>
    <form class="p-4 flex flex-col gap-3 w-[300px]" onsubmit={e => { e.preventDefault(); submit(); }}>
        <h2 class="text-lg font-semibold">{taskToEdit ? "Edit Task" : "Add Task"}</h2>

        <input type="text" placeholder="Title" bind:value={title} class="border px-2 py-1 rounded" required />
        <textarea placeholder="Description" bind:value={description} class="border px-2 py-1 rounded"></textarea>
        <input type="date" bind:value={dueDate} class="border px-2 py-1 rounded" />
        <input type="number" min="1" bind:value={storyPoints} class="border px-2 py-1 rounded" />
        <select bind:value={priority} class="border px-2 py-1 rounded">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
        </select>

        <div class="flex justify-end gap-2 mt-2">
            <button type="button" onclick={cancel} class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                {taskToEdit ? "Save" : "Add"}
            </button>
        </div>
    </form>
</dialog>
