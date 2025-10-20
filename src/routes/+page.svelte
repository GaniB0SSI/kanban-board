<script>
    import TaskModal from "$lib/components/TaskModal.svelte";
    import { onMount } from "svelte";
    import { format, parseISO, isValid } from "date-fns";

    let tasks = [];
    let modalRef;
    let currentTaskToEdit = null;
    let userCountry = "Unknown";

    // Load tasks from localStorage
    onMount(async () => {
        const saved = localStorage.getItem("kanban-tasks");
        if (saved) tasks = JSON.parse(saved);

        // Geo-API: detect country
        try {
            const res = await fetch("https://ipapi.co/json/");
            if (res.ok) {
                const data = await res.json();
                userCountry = data.country_name || "Unknown";
            }
        } catch (err) {
            console.warn("Geo lookup failed:", err);
        }
    });

    // Persist tasks
    $: if (typeof window !== "undefined") {
        localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
    }

    // Helpers: date formatting
    function fmt(dateString) {
        if (!dateString) return "-";
        try {
            const d = parseISO(dateString);
            if (!isValid(d)) return dateString;
            return format(d, "d. MMM yyyy, HH:mm");
        } catch {
            return dateString;
        }
    }

    // Add a new task
    function addTask(newTask) {
        newTask.id = crypto.randomUUID();
        newTask.createdAt = new Date().toISOString();
        tasks = [...tasks, { ...newTask, lane: "todo" }];
    }

    // Edit an existing task
    function editTask(updatedTask) {
        tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    }

    // Delete a task
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
    }

    // Open modal for add
    function openModal() {
        currentTaskToEdit = null;
        if (modalRef && typeof modalRef.showDialog === "function") modalRef.showDialog();
        else console.error("modalRef/showDialog not available");
    }

    // Open modal for edit
    function openEditModal(task) {
        currentTaskToEdit = task;
        if (modalRef && typeof modalRef.showDialog === "function") modalRef.showDialog();
        else console.error("modalRef/showDialog not available");
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
                if (lane === "done" && t.lane !== "done") notifyTaskDone(t);
                return { ...t, lane };
            }
            return t;
        });
        draggedTaskId = null;
    }

    // Notifications when done
    function notifyTaskDone(task) {
        if (typeof window === "undefined") return;
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(`Task Done: ${task.title}`, { body: `Due: ${task.dueDate}` });
                }
            });
        } else {
            new Notification(`Task Done: ${task.title}`, { body: `Due: ${task.dueDate}` });
        }
    }

    // ICS Export
    function exportICS(task) {
        const start = task.dueDate ? new Date(task.dueDate) : new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${task.title}
DESCRIPTION:${task.description}
DTSTART:${formatICS(start)}
DTEND:${formatICS(end)}
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
    function formatICS(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    // CSV export
    function exportCSV() {
        if (!tasks.length) {
            alert("No tasks to export.");
            return;
        }
        const headers = ["Title", "Description", "Created At", "Due Date", "Story Points", "Priority", "Lane"];
        const rows = tasks.map(t => [
            t.title || "",
            t.description || "",
            t.createdAt ? fmt(t.createdAt) : "",
            t.dueDate ? fmt(t.dueDate) : "",
            t.storyPoints ?? "",
            t.priority || "",
            t.lane || ""
        ]);
        const csvContent = [headers, ...rows]
            .map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kanban-tasks.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    // Web Share API
    async function shareTask(task) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: task.title,
                    text: `${task.description}\nDue: ${task.dueDate ? fmt(task.dueDate) : "-"}`,
                    url: window.location.href
                });
            } catch (err) {
                console.warn("Share canceled/failed:", err);
            }
        } else {
            // fallback: copy to clipboard
            const text = `${task.title}\n${task.description}\nDue: ${task.dueDate ? fmt(task.dueDate) : "-"}`;
            try {
                await navigator.clipboard.writeText(text);
                alert("Task copied to clipboard (share not supported).");
            } catch {
                alert("Share not supported and clipboard write failed.");
            }
        }
    }
</script>

<!-- Header -->
<div class="flex justify-between items-center p-4 bg-blue-600 text-white">
    <h1 class="text-lg font-semibold">Kanban Board</h1>

    <div class="flex items-center gap-3">
        <button onclick={openModal} class="px-3 py-2 bg-white text-blue-600 rounded">Add Task</button>
        <button onclick={exportCSV} class="px-3 py-2 bg-green-600 text-white rounded">Download CSV</button>
        <span class="text-sm opacity-90">🌐 {userCountry}</span>
    </div>
</div>

<!-- Board -->
<div class="flex gap-4 p-4 flex-wrap">
    {#each ["todo","doing","done","archive"] as lane}
        <section
            role="list"
            class="w-[230px] bg-gray-100 p-3 rounded flex flex-col gap-2"
            ondragover={e => e.preventDefault()}
            ondrop={() => handleDrop(lane)}
        >
            <h2 class="font-bold mb-2 capitalize">
                {lane} ({tasks.filter(t => t.lane === lane).reduce((sum, t) => sum + (t.storyPoints || 0), 0)} SP)
            </h2>

            {#each tasks.filter(t => t.lane === lane) as task (task.id)}
                <div
                    role="listitem"
                    data-id={task.id}
                    class="bg-white p-2 rounded shadow cursor-move {task.dueDate && new Date(task.dueDate) < new Date() ? 'border-2 border-red-500' : ''}"
                    draggable="true"
                    ondragstart={handleDragStart}
                >
                    <h3 class="font-semibold">{task.title}</h3>
                    <p class="text-sm">{task.description}</p>
                    <p class="text-xs text-gray-500">Created: {task.createdAt ? fmt(task.createdAt) : "-"}</p>
                    <p class="text-xs text-gray-500">Due: {task.dueDate ? fmt(task.dueDate) : "-"}</p>
                    <p class="text-xs text-gray-500">SP: {task.storyPoints} | Priority: {task.priority}</p>

                    <div class="mt-2 flex flex-wrap gap-2">
                        <button onclick={() => openEditModal(task)} class="px-2 py-1 text-xs bg-yellow-400 text-white rounded">Edit</button>
                        <button onclick={() => deleteTask(task.id)} class="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
                        <button onclick={() => exportICS(task)} class="px-2 py-1 text-xs bg-green-500 text-white rounded">ICS</button>
                        <button onclick={() => shareTask(task)} class="px-2 py-1 text-xs bg-blue-500 text-white rounded">Share</button>
                    </div>
                </div>
            {/each}
        </section>
    {/each}
</div>

<!-- Task Modal -->
<TaskModal bind:this={modalRef} onAddTask={addTask} onEditTask={editTask} taskToEdit={currentTaskToEdit} />
