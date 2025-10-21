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
        { key: "todo", label: "Do", color: "bg-slate-100" },
        { key: "doing", label: "Doing", color: "bg-blue-50" },
        { key: "done", label: "Done", color: "bg-emerald-50" },
        { key: "archive", label: "Archive", color: "bg-gray-50" }
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

<div class="bg-gray-100 min-h-screen p-6">
    <div class="flex gap-6 overflow-x-auto">
        {#each lanes as lane}
            <div class="flex-shrink-0 w-80">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <!-- Lane Header -->
                    <div class="bg-gray-200 px-4 py-3 rounded-t-lg border-b border-gray-300">
                        <div class="flex items-center justify-between">
                            <h2 class="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                                {lane.label}
                            </h2>
                            <div class="flex items-center space-x-2">
                                <span class="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {tasks.filter(t => t.lane === lane.key).length}
                                </span>
                                <span class="text-xs text-gray-600 font-medium">
                                    SP: {getStoryPointsForLane(lane.key)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Lane Content -->
                    <div 
                        class="p-4 min-h-96 {lane.color}"
                        ondragover={e => e.preventDefault()}
                        ondrop={() => onDrop(lane.key)}
                    >
                        <div class="space-y-3">
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
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>