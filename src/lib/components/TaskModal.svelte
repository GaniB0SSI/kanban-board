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

	// Validation state
	let touchedTitle = false;
	let touchedDescription = false;
	let touchedDueDate = false;
	let touchedStoryPoints = false;
	let touchedPriority = false;

	$: parsedStoryPoints = Number.isFinite(Number(storyPoints)) ? Math.trunc(Number(storyPoints)) : 0;
	$: validTitle = title.trim().length > 0;
	$: validDescription = description.trim().length > 0;
	$: validDueDate = String(dueDate).trim().length > 0;
	$: validStoryPoints = parsedStoryPoints > 0;
	$: validPriority = String(priority).trim().length > 0;
	$: isFormValid = validTitle && validDescription && validDueDate && validStoryPoints && validPriority;

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
		if (!isFormValid) return;

        const taskData = {
            title,
            description,
            dueDate,
			storyPoints: parsedStoryPoints,
            priority,
            lane: taskToEdit ? taskToEdit.lane : "todo"
        };

        if (taskToEdit) {
            onEditTask({ ...taskToEdit, ...taskData });
        } else {
            onAddTask(taskData);
        }

        reset();
        dialogEl.close();
    }

    function reset() {
        title = "";
        description = "";
        dueDate = "";
		storyPoints = 1;
        priority = "Medium";

		touchedTitle = false;
		touchedDescription = false;
		touchedDueDate = false;
		touchedStoryPoints = false;
		touchedPriority = false;
    }

    function cancel() {
        dialogEl.close();
    }

    export function showDialog() {
        dialogEl.showModal();
    }
</script>

<dialog bind:this={dialogEl}>
    <form class="p-4 flex flex-col gap-3 w-[300px]" onsubmit={e => { e.preventDefault(); submit(); }}>

        <h2 class="text-lg font-semibold">{taskToEdit ? "Edit Task" : "Add Task"}</h2>

        <input id="title" name="title" type="text" placeholder="Title" bind:value={title} class="border px-2 py-1 rounded" aria-invalid={!validTitle} onblur={() => touchedTitle = true} required />
        {#if touchedTitle && !validTitle}
            <p class="text-xs text-red-600">Title is required.</p>
        {/if}

        <textarea id="description" name="description" placeholder="Description" bind:value={description} class="border px-2 py-1 rounded" aria-invalid={!validDescription} onblur={() => touchedDescription = true}></textarea>
        {#if touchedDescription && !validDescription}
            <p class="text-xs text-red-600">Description is required.</p>
        {/if}

        <input id="dueDate" name="dueDate" type="date" bind:value={dueDate} class="border px-2 py-1 rounded" aria-invalid={!validDueDate} onblur={() => touchedDueDate = true} />
        {#if touchedDueDate && !validDueDate}
            <p class="text-xs text-red-600">Due date is required.</p>
        {/if}

        <input id="storyPoints" name="storyPoints" type="number" min="1" bind:value={storyPoints} class="border px-2 py-1 rounded" aria-invalid={!validStoryPoints} onblur={() => touchedStoryPoints = true} />
        {#if touchedStoryPoints && !validStoryPoints}
            <p class="text-xs text-red-600">Story points must be a positive integer.</p>
        {/if}

        <select id="priority" name="priority" bind:value={priority} class="border px-2 py-1 rounded" aria-invalid={!validPriority} onblur={() => touchedPriority = true}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
        </select>
        {#if touchedPriority && !validPriority}
            <p class="text-xs text-red-600">Priority is required.</p>
        {/if}

        <div class="flex justify-end gap-2 mt-2">
            <button type="button" onclick={cancel} class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isFormValid}>
                {taskToEdit ? "Save" : "Add"}
            </button>
        </div>
    </form>
</dialog>
