<script>
	import TaskModal from "$lib/components/TaskModal.svelte";
	import { onMount } from "svelte";

	let tasks = [];
	let modalEl; // real <dialog> element from TaskModal

	onMount(() => {
		const saved = localStorage.getItem("kanban-tasks");
		if (saved) tasks = JSON.parse(saved);
	});

	$: if (typeof window !== "undefined") {
		localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
	}

	function addTask(newTask) {
		newTask.id = crypto.randomUUID();
		tasks = [...tasks, newTask];
	}

	function editTask(updated) {
		tasks = tasks.map(t => (t.id === updated.id ? updated : t));
	}

	function deleteTask(id) {
		tasks = tasks.filter(t => t.id !== id);
	}

	function openModal() {
		console.log("open modal");
		modalEl.showModal();
	}

	let draggedTaskId = null;

	function handleDragStart(e) {
		draggedTaskId = e.currentTarget.dataset.id;
	}

	function handleDrop(lane) {
		if (!draggedTaskId) return;
		tasks = tasks.map(t =>
			t.id == draggedTaskId ? { ...t, lane } : t
		);
		draggedTaskId = null;
	}
</script>

<!-- Header -->
<div class="flex justify-between items-center p-4 bg-blue-600 text-white">
	<h1 class="text-lg font-semibold">Kanban Board</h1>
	<button
		onclick={openModal}
		class="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-100"
	>
		Add Task
	</button>
</div>

<!-- Board -->
<div class="flex gap-4 p-4 flex-wrap">
	{#each ["todo", "doing", "done", "archive"] as lane}
		<section
			class="w-[200px] bg-gray-100 p-2 rounded flex flex-col gap-2"
			ondragover={e => e.preventDefault()}
			ondrop={() => handleDrop(lane)}
		>
			<h2 class="font-bold mb-2 capitalize">
				{lane}
				({tasks.filter(t => t.lane === lane).reduce((s, t) => s + t.storyPoints, 0)} SP)
			</h2>

			{#each tasks.filter(t => t.lane === lane) as task (task.id)}
				<div
					data-id={task.id}
					class="bg-white p-2 rounded shadow cursor-move"
					draggable="true"
					ondragstart={handleDragStart}
				>
					<h3 class="font-semibold">{task.title}</h3>
					<p class="text-sm">{task.description}</p>
					<p class="text-xs text-gray-500">Due: {task.dueDate}</p>
					<p class="text-xs text-gray-500">
						SP: {task.storyPoints} | Priority: {task.priority}
					</p>

					<div class="mt-2 flex gap-2">
						<button
							class="px-2 py-1 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500"
							onclick={() => editTask({ ...task, title: task.title + ' ✏️' })}
						>
							Edit
						</button>
						<button
							class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
							onclick={() => deleteTask(task.id)}
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</section>
	{/each}
</div>

<!-- Modal -->
<TaskModal bind:dialogEl={modalEl} onAddTask={addTask} />
