<script>
	import TaskModal from "$lib/components/TaskModal.svelte";

	let tasks = [];
	let modalRef;

	// Load tasks from localStorage on app start
	if (typeof localStorage !== "undefined") {
		const saved = localStorage.getItem("kanban-tasks");
		if (saved) tasks = JSON.parse(saved);
	}

	// Whenever tasks change, save to localStorage
	$: localStorage.setItem("kanban-tasks", JSON.stringify(tasks));

	function addTask(newTask) {
		tasks = [...tasks, newTask];
	}

	function openModal() {
		modalRef.showDialog();
	}

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
git add .
git commit -m "feat(storage): persist tasks in localStorage"

<!-- Header / Add Task -->
<div class="flex justify-between items-center p-4 bg-blue-600 text-white">
	<h1 class="text-lg font-semibold">Kanban Board</h1>
	<button onclick={() => modalRef.showDialog()} class="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
	Add Task
</button>

<TaskModal bind:this={modalRef} onAddTask={addTask}/>
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
			<h2 class="font-bold mb-2 capitalize">{lane}</h2>

			{#each tasks.filter(t => t.lane === lane) as task (task.id)}
				<div
					class="bg-white p-2 rounded shadow cursor-move"
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
