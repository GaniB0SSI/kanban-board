<script>
  export let onAddTask;      // callback for adding a new task
  export let onEditTask;     // callback for editing an existing task
  export let taskToEdit = null; // the task object to edit
  let dialogEl;

  let title = "";
  let description = "";
  let dueDate = "";
  let storyPoints = 1;
  let priority = "Medium";

  // When modal opens for editing, fill form fields
  $: if (taskToEdit) {
    title = taskToEdit.title;
    description = taskToEdit.description;
    dueDate = taskToEdit.dueDate || "";
    storyPoints = taskToEdit.storyPoints;
    priority = taskToEdit.priority;
  }

  function submit() {
    const task = { 
      ...taskToEdit, 
      title, 
      description, 
      dueDate, 
      storyPoints, 
      priority 
    };

    if (taskToEdit) {
      onEditTask(task);
    } else {
      onAddTask(task);
    }
    resetForm();
    closeDialog();
  }

  function resetForm() {
    title = "";
    description = "";
    dueDate = "";
    storyPoints = 1;
    priority = "Medium";
    taskToEdit = null;
  }

  function showDialog() {
    dialogEl.showModal();
  }

  function closeDialog() {
    dialogEl.close();
  }
</script>

<dialog bind:this={dialogEl}>
  <form on:submit={e => { e.preventDefault(); submit(); }} class="p-4 flex flex-col gap-3 w-[300px]">
    <h2 class="text-lg font-semibold">{taskToEdit ? "Edit Task" : "Add New Task"}</h2>

    <input
      type="text"
      placeholder="Title"
      bind:value={title}
      required
      class="border px-2 py-1 rounded"
    />

    <textarea
      placeholder="Description"
      bind:value={description}
      class="border px-2 py-1 rounded"
    ></textarea>

    <input
      type="date"
      bind:value={dueDate}
      class="border px-2 py-1 rounded"
    />

    <input
      type="number"
      min="1"
      max="100"
      bind:value={storyPoints}
      class="border px-2 py-1 rounded"
    />

    <select bind:value={priority} class="border px-2 py-1 rounded">
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>

    <div class="flex justify-end gap-2 mt-2">
      <button
        type="button"
        on:click={closeDialog}
        class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {taskToEdit ? "Save" : "Add"}
      </button>
    </div>
  </form>
</dialog>
