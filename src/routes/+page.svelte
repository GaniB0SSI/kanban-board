<script>
    import TaskModal from "$lib/components/TaskModal.svelte";
    import { onMount } from "svelte";

    let tasks = [];
    let modalRef;
    let currentTaskToEdit = null;

    // Load tasks from localStorage
    onMount(() => {
        const saved = localStorage.getItem("kanban-tasks");
        if (saved) {
            const parsed = JSON.parse(saved);
            // migrate/coerce values to ensure numbers for SP and valid lanes
            tasks = parsed.map(t => ({
                ...t,
                storyPoints: Number(t.storyPoints || 0),
                lane: t.lane || "todo"
            }));
        }
    });

    // Save tasks whenever they change
    $: if (typeof window !== "undefined") {
        localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
    }

    // Add a new task
    function addTask(newTask) {
    const task = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        storyPoints: Number(newTask.storyPoints) || 0, // ✅ important
        priority: newTask.priority,
        lane: "todo"
    };
    tasks = [...tasks, task];
}

    // Edit existing task
    function editTask(updatedTask) {
        updatedTask.storyPoints = Number(updatedTask.storyPoints) || 0; // ✅ ensure numeric
        tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    }

    // Delete a task
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
    }

    // Open modal for adding
    function openModal() {
        currentTaskToEdit = null;
        modalRef.showDialog();
    }

    // Open modal for editing
    function openEditModal(task) {
        currentTaskToEdit = task;
        modalRef.showDialog();
    }

    // Drag & Drop
    let draggedTaskId = null;

    function handleDragStart(event) {
        draggedTaskId = event.currentTarget.dataset.id;
    }

    function handleDrop(lane) {
        if (!draggedTaskId) return;

        tasks = tasks.map(t => {
            if (t.id == draggedTaskId) {
                if (lane === "done" && t.lane !== "done") {
                    notifyTaskDone(t);
                }
                return { ...t, lane };
            }
            return t;
        });

        draggedTaskId = null;
    }

    // Notifications
    function notifyTaskDone(task) {
        if (typeof window === "undefined") return;

        if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(`Task Done: ${task.title}`, {
                        body: `Due: ${task.dueDate}`
                    });
                }
            });
        } else {
            new Notification(`Task Done: ${task.title}`, {
                body: `Due: ${task.dueDate}`
            });
        }
    }

    // ICS Export
    function exportICS(task) {
        const start = new Date(task.dueDate);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${task.title}
DESCRIPTION:${task.description}
DTSTART:${formatDateICS(start)}
DTEND:${formatDateICS(end)}
END:VEVENT
END:VCALENDAR
`.trim();

        const blob = new Blob([icsContent], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${task.title}.ics`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function formatDateICS(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    // Web Share API
    async function shareTask(task) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: task.title,
                    text: `${task.description}\nDue: ${task.dueDate}`,
                    url: window.location.href
                });
            } catch (err) {
                console.error("Share canceled or failed:", err);
            }
        } else {
            alert("Web Share API not supported on this device.");
        }
    }

    // ✅ Function to calculate total SP per lane
    function getStoryPoints(lane) {
        return tasks
            .filter(t => t.lane === lane)
            .reduce((sum, t) => {
                const raw = t.storyPoints;
                const parsed = Number.parseInt(String(raw ?? 0), 10);
                return sum + (Number.isFinite(parsed) ? parsed : 0);
            }, 0);
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
<div class="flex gap-4 p-4 flex-wrap">
    {#each ["todo", "doing", "done", "archive"] as lane}
        <section
            role="list"
            class="w-[230px] bg-gray-100 p-3 rounded flex flex-col gap-2"
            ondragover={e => e.preventDefault()}
            ondrop={() => handleDrop(lane)}
        >
            <h2 class="font-bold mb-2 capitalize">
                {lane} ({getStoryPoints(lane)} SP)
            </h2>

            {#each tasks.filter(t => t.lane === lane) as task (task.id)}
                <div
                    role="listitem"
                    data-id={task.id}
                    class="bg-white p-2 rounded shadow cursor-move {new Date(task.dueDate) < new Date() ? 'border-2 border-red-500' : ''}"
                    draggable="true"
                    ondragstart={handleDragStart}
                >
                    <h3 class="font-semibold">{task.title}</h3>
                    <p class="text-sm">{task.description}</p>
                    <p class="text-xs text-gray-500">Due: {task.dueDate}</p>
                    <p class="text-xs text-gray-500">SP: {task.storyPoints} | Priority: {task.priority}</p>

                    <div class="mt-2 flex flex-wrap gap-2">
                        <button class="px-2 py-1 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500"
                            onclick={() => openEditModal(task)}>Edit</button>
                        <button class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            onclick={() => deleteTask(task.id)}>Delete</button>
                        <button class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            onclick={() => exportICS(task)}>ICS</button>
                        <button class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            onclick={() => shareTask(task)}>Share</button>
                    </div>
                </div>
            {/each}
        </section>
    {/each}
</div>

<TaskModal bind:this={modalRef} onAddTask={addTask} onEditTask={editTask} taskToEdit={currentTaskToEdit} />
