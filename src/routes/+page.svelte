<script>
	import { flip } from "svelte/animate";

	let todo = ["Task 1", "Task 2"];
	let doing = ["Task 3"];
	let done = ["Task 4"];
	let archive = [];

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
</script>

<h1 class="text-center text-xl font-semibold mb-4">Simple Kanban Board</h1>

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
