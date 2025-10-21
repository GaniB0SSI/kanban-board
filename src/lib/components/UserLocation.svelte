<script>
	import { onMount } from "svelte";

	let country = "Loading...";
	let error = null;

onMount(async () => {
    try {
        // Try ipapi first
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("ipapi failed");
        const data = await res.json();
        country = data.country_name || "Unknown";
        return;
    } catch {}

    try {
        // Fallback: ipwho.is (CORS-friendly)
        const res2 = await fetch("https://ipwho.is/");
        const data2 = await res2.json();
        country = data2.country || "Unknown";
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
