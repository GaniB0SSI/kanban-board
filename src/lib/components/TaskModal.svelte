<script>
	export let open = false;
	export let onAddTask;

	let title = "";
	let description = "";
	let dueDate = "";
	let storyPoints = 1;
	let priority = "Medium";

	let dialogEl;

	function showDialog() {
		open = true;
		dialogEl?.showModal();
	}

	function closeDialog() {
		open = false;
		dialogEl?.close();
	}

	function submitTask() {
		if (!title.trim()) return;

		const task = {
			id: Date.now(),
			title: title.trim(),
			description: description.trim(),
			creationDate: new Date().toISOString(),
			dueDate,
			storyPoints: Number(storyPoints),
			priority,
			lane: "todo",
		};

		onAddTask(task);
		resetForm();
	}

	function resetForm() {
		title = "";
		description = "";
		dueDate = "";
		storyPoints = 1;
		priority = "Medium";
		closeDialog();
	}
</script>

<dialog bind:this={dialogEl}>
	<form onsubmit={e => { e.preventDefault(); submitTask(); }} class="p-4 flex flex-col gap-3 w-[300px]">
		<h2 class="text-lg font-semibold">Add New Task</h2>

		<input type="text" placeholder="Title" value={title} oninput={e => title = e.target.value} required class="border px-2 py-1 rounded"/>
		<textarea placeholder="Description" value={description} oninput={e => description = e.target.value} class="border px-2 py-1 rounded"/>
		<input type="date" value={dueDate} oninput={e => dueDate = e.target.value} class="border px-2 py-1 rounded"/>
		<input type="number" min="1" max="100" value={storyPoints} oninput={e => storyPoints = +e.target.value} class="border px-2 py-1 rounded"/>
		<select value={priority} oninput={e => priority = e.target.value} class="border px-2 py-1 rounded">
			<option>Low</option>
			<option>Medium</option>
			<option>High</option>
		</select>

		<div class="flex justify-end gap-2 mt-2">
			<button type="button" onclick={closeDialog} class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
			<button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
		</div>
	</form>
</dialog>
