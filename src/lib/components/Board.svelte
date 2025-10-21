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

	// ✅ Compute total SP per lane reactively
	function getStoryPoints(laneKey) {
		if (!tasks || tasks.length === 0) return 0;
		return tasks
			.filter((t) => t.lane === laneKey)
			.reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0);
	}
</script>

<div class="flex gap-4 p-4 flex-wrap">
	{#each lanes as lane}
		<section
			class="w-[230px] bg-gray-100 p-3 rounded flex flex-col gap-2"
			ondragover={(e) => e.preventDefault()}
			ondrop={() => onDrop(lane.key)}
		>
			<h2 class="font-bold mb-2 flex justify-between items-center">
				<span>{lane.label}</span>
				<span class="text-sm text-gray-600">SP {getStoryPoints(lane.key)}</span>
			</h2>

			{#each tasks.filter((t) => t.lane === lane.key) as task (task.id)}
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
