<script>
	import { onMount } from "svelte";

	let country = "Loading...";
	let error = null;

	onMount(async () => {
		try {
			const res = await fetch("https://ipapi.co/json/");
			if (!res.ok) throw new Error("Geo API request failed");
			const data = await res.json();
			country = data.country_name || "Unknown";
		} catch (err) {
			error = "Could not fetch location";
			country = "Unavailable";
			console.error(err);
		}
	});
</script>

<footer class="p-4 bg-gray-200 text-gray-700 text-center text-sm mt-8">
	{#if error}
		<span>{error}</span>
	{:else}
		<span>🌍 Your location: {country}</span>
	{/if}
</footer>

<style>
	footer {
		position: sticky;
		bottom: 0;
		width: 100%;
	}
</style>
