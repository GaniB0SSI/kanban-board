<script>
	export let onAddTask;
	export let dialogEl;

	let title = "";
	let description = "";
	let dueDate = "";
	let storyPoints = 1;
	let priority = "Medium";

	function submit() {
		if (!title.trim()) return;
		onAddTask({
			id: crypto.randomUUID(),
			title,
			description,
			dueDate,
			storyPoints,
			priority,
			lane: "todo"
		});
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
</script>

<dialog bind:this={dialogEl}>
	<form onsubmit={e => { e.preventDefault(); submit(); }} class="p-4 flex flex-col gap-3 w-[300px]">
		<h2 class="text-lg font-semibold">Add Task</h2>

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
			<button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
		</div>
	</form>
</dialog>
