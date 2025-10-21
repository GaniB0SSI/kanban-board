<script>
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
                const parsed = Number.parseInt(String(raw ?? 0), 10);
                return sum + (Number.isFinite(parsed) ? parsed : 0);
            }, 0);
    }
</script>

<div class="flex gap-6 p-6 flex-wrap">
    {#each lanes as lane}
        <section
            role="list"
            class="lane w-[260px] p-4 flex flex-col gap-3"
            ondragover={e => e.preventDefault()}
            ondrop={() => onDrop(lane.key)}
        >
            <h2 class="text-sm font-semibold tracking-wide flex justify-between items-center">
                <span>{lane.label}</span>
                <span class="badge badge-muted">SP {getStoryPointsForLane(lane.key)}</span>
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