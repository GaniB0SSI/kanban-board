<script>
	import TaskModal from "$lib/components/TaskModal.svelte";
	import { onMount } from "svelte";

	let tasks = [];
	let modalRef;

	// Load tasks from localStorage only on the client
	onMount(() => {
		const saved = localStorage.getItem("kanban-tasks");
		if (saved) tasks = JSON.parse(saved);
	});

	// Save tasks whenever they change (client-side only)
	$: if (typeof window !== "undefined") {
		localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
	}

	// Add a new task
	function addTask(newTask) {
		tasks = [...tasks, newTask];
	}

	// Open modal
	function openModal() {
		modalRef.showDialog();
	}

	// Drag & Drop
	let draggedTaskId = null;

	function handleDragStart(taskId) {
		draggedTaskId = taskId;
	}

	function handleDrop(lane) {
		if (!draggedTaskId) return;
		tasks = tasks.map(t => t.id === draggedTaskId ? { ...t, lane } : t);
		draggedTaskId = null;
	}
</script>


<!-- Header -->
<div class="flex justify-between items-center p-4 bg-blue-600 text-white">
	<h1 class="text-lg font-semibold">Kanban Board</h1>
	<button onclick={openModal} class="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-100">
		Add Task
	</button>
</div>

<!-- Kanban Board -->
<div class="flex gap-4 p-4">
	{#each ["todo", "doing", "done", "archive"] as lane}
		<section
			role="list"
			class="w-[200px] bg-gray-100 p-2 rounded flex flex-col gap-2"
			ondragover={e => e.preventDefault()}
			ondrop={() => handleDrop(lane)}
		>
			<!-- Lane header with Story Points sum -->
			<h2 class="font-bold mb-2 capitalize">
				{lane} ({tasks.filter(t => t.lane === lane).reduce((sum, t) => sum + t.storyPoints, 0)} SP)
			</h2>

			<!-- Tasks -->
			{#each tasks.filter(t => t.lane === lane) as task (task.id)}
				<div
					role="listitem"
					class="bg-white p-2 rounded shadow cursor-move {new Date(task.dueDate) < new Date() ? 'border-2 border-red-500' : ''}"
					draggable="true"
					ondragstart={() => handleDragStart(task.id)}
				>
					<h3 class="font-semibold">{task.title}</h3>
					<p class="text-sm">{task.description}</p>
					<p class="text-xs text-gray-500">Due: {task.dueDate}</p>
					<p class="text-xs text-gray-500">SP: {task.storyPoints} | Priority: {task.priority}</p>
				</div>
			{/each}
		</section>
	{/each}
</div>

<!-- Task Modal -->
<TaskModal bind:this={modalRef} onAddTask={addTask}/>
