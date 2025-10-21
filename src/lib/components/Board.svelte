<script>
    import Lane from "./Lane.svelte";
    import IssueCard from "./IssueCard.svelte";

    export let tasks = [];
    export let onDragStart;
    export let onDrop;
    export let onEdit;
    export let onDelete;
    export let onExportICS;
    export let onShare;

    const lanes = [
        { key: "todo", label: "Do" },
        { key: "doing", label: "Doing" },
        { key: "done", label: "Done" },
        { key: "archive", label: "Archiv" }
    ];

    // Calculate story points per lane
    function getStoryPointsForLane(laneKey) {
        return tasks
            .filter((t) => t.lane === laneKey)
            .reduce((sum, t) => {
                const raw = t.storyPoints;
                const parsed = Number.parseInt(String(raw ?? 0).toString().trim(), 10);
                return sum + (Number.isFinite(parsed) ? parsed : 0);
            }, 0);
    }

    // Count cards per lane
    function getCountForLane(laneKey) {
        return tasks.filter((t) => t.lane === laneKey).length;
    }
</script>

<div class="flex gap-4 p-4 flex-wrap">
    {#each lanes as lane}
        <section
            role="list"
            class="w-[230px] bg-gray-100 p-3 rounded flex flex-col gap-2"
            ondragover={e => e.preventDefault()}
            ondrop={() => onDrop(lane.key)}
        >
            <h2 class="font-bold mb-2">
                {lane.label} (SP {getStoryPointsForLane(lane.key)})
            </h2>

            {#each tasks.filter(t => t.lane === lane.key) as task (task.id)}
                <IssueCard
                    {task}
                    {onEdit}
                    {onDelete}
                    onExportICS={onExportICS}
                    onShare={onShare}
                    onDragStart={onDragStart}
                />
            {/each}
        </section>
    {/each}
</div>
