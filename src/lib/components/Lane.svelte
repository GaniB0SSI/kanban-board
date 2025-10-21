<script>
    import IssueCard from "./IssueCard.svelte";

    export let title;
    export let tasks = [];
    export let onDrop;
    export let onEdit;
    export let onDelete;
    export let onDownload;
    export let onShare;

    function handleDrop(event) {
        const taskData = event.dataTransfer.getData("task");
        if (taskData) {
            const task = JSON.parse(taskData);
            onDrop(task, title);
        }
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    $: totalStoryPoints = tasks.reduce((sum, t) => sum + Number(t.storyPoints || 0), 0);
</script>

<div
    role="list"
    class="lane bg-gray-100 rounded-xl shadow p-4 w-[300px] flex flex-col gap-3"
    ondrop={handleDrop}
    ondragover={allowDrop}
>
    <h2 class="text-xl font-semibold mb-2">
        {title} <span class="text-gray-500 text-sm">(Story Points: {totalStoryPoints})</span>
    </h2>

    {#each tasks as task (task.id)}
        <IssueCard
            {task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDownload={onDownload}
            onShare={onShare}
        />
    {/each}
</div>
