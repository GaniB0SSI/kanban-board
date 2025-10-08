<script>
	import { flip } from "svelte/animate";

	let todo = ["Task 1", "Task 2"];
	let doing = ["Task 3"];
	let done = ["Task 4"];
	let archive = [];
	let newTask = "";
	let showModal = false; 


	function handleDragStart(item, from, e) {
		e.dataTransfer.setData("item", item);
		e.dataTransfer.setData("from", from);
	}

	function handleDragOver(e) {
		e.preventDefault();
	}

	function handleDrop(to, e) {
		e.preventDefault();

		const item = e.dataTransfer.getData("item");
		const from = e.dataTransfer.getData("from");

		if (from === "todo") todo = todo.filter(i => i !== item);
		if (from === "doing") doing = doing.filter(i => i !== item);
		if (from === "done") done = done.filter(i => i !== item);
		if (from === "archive") archive = archive.filter(i => i !== item);

		if (to === "todo") todo.push(item);
		if (to === "doing") doing.push(item);
		if (to === "done") done.push(item);
		if (to === "archive") archive.push(item);
	}

	function openModal() {
		showModal = true;
		newTask = "";
	}

	function addTask() {
		if (newTask.trim() === "") return;
		todo.push(newTask.trim());
		newTask = "";
		showModal = false;
	}
</script>

<!-- 🧭 Navigation bar -->
<nav class="flex justify-between items-center bg-blue-600 text-white px-6 py-3">
	<h1 class="text-lg font-semibold">My Kanban</h1>
	<button
	onclick={openModal}
	class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
	Add Task
</button>
</nav>

<!-- 📋 Board -->
<main class="flex justify-center gap-6 p-8 bg-gray-100 min-h-[400px]">
	{#each [
		{ id: "todo", title: "To Do", items: todo },
		{ id: "doing", title: "Doing", items: doing },
		{ id: "done", title: "Done", items: done },
		{ id: "archive", title: "Archive", items: archive }
	] as { id, title, items }}
		<section
			class="h-[350px] w-[150px] bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-start p-2"
			ondragover={handleDragOver}
			ondrop={(e) => handleDrop(id, e)}
		>
			<h2 class="font-bold mb-2">{title}</h2>
			{#each items as item (item)}
				<article
					class="p-3 bg-blue-300 rounded-md mb-2 cursor-move w-full text-center shadow"
					draggable="true"
					ondragstart={(e) => handleDragStart(item, id, e)}
					animate:flip
				>
					{item}
				</article>
			{/each}
		</section>
	{/each}
</main>

<!-- 💬 Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black/40 flex justify-center items-center">
		<div class="bg-white rounded-lg shadow-lg p-6 w-[300px]">
			<h2 class="text-lg font-semibold mb-3">Add a new task</h2>
			<input
				bind:value={newTask}
				type="text"
				placeholder="Task name..."
				class="border border-gray-300 rounded w-full px-2 py-1 mb-3 focus:outline-none focus:ring"
			/>
			<div class="flex justify-end gap-2">
				<button
	class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
	onclick={() => (showModal = false)}
>
	Cancel
</button>
				<button
					class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
					onclick={() => addTask()}
				>
					Add
				</button>
			</div>
		</div>
	</div>
{/if}
