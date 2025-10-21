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
    // unique id prefix so labels can reference inputs (avoids collisions if multiple modals)
    const uid = Date.now().toString(36) + Math.random().toString(36).slice(2,8);

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
        const parsedSP = Number(storyPoints) || 0;
        if (!title.trim() || !description.trim() || !dueDate.trim() || parsedSP <= 0) return;

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            dueDate,
            storyPoints: parsedSP,
            priority,
            lane: taskToEdit ? taskToEdit.lane : "todo"
        };

        if (taskToEdit) onEditTask({ ...taskToEdit, ...taskData });
        else onAddTask(taskData);

        reset();
        dialogEl.close();
    }

    function reset() {
        title = "";
        description = "";
        dueDate = "";
        storyPoints = 1;
        priority = "Medium";
    }

    function cancel() {
        dialogEl.close();
    }

    export function showDialog() {
        dialogEl.showModal();
    }
</script>

<dialog bind:this={dialogEl} class="backdrop:bg-black backdrop:bg-opacity-50 rounded-lg shadow-xl">
    <div class="bg-white rounded-lg p-6 w-96 max-w-full">
        <form onsubmit={e => { e.preventDefault(); submit(); }}>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
                {taskToEdit ? "Edit Task" : "Add Task"}
            </h2>

            <div class="space-y-4">
                <div>
                    <label for={"title-" + uid} class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input 
                        id={"title-" + uid}
                        type="text" 
                        bind:value={title} 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required 
                    />
                </div>

                <div>
                    <label for={"description-" + uid} class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        id={"description-" + uid}
                        bind:value={description} 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div>
                    <label for={"duedate-" + uid} class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input 
                        id={"duedate-" + uid}
                        type="date" 
                        bind:value={dueDate} 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required 
                    />
                </div>

                <div>
                    <label for={"sp-" + uid} class="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                    <input 
                        id={"sp-" + uid}
                        type="number" 
                        min="1" 
                        bind:value={storyPoints} 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required 
                    />
                </div>

                <div>
                    <label for={"priority-" + uid} class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select 
                        id={"priority-" + uid}
                        bind:value={priority} 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
                <button 
                    type="button" 
                    onclick={cancel} 
                    class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    {taskToEdit ? "Save" : "Add"}
                </button>
            </div>
        </form>
    </div>
</dialog>