<script>
  import { onMount } from "svelte";

  let country = "Loading...";

  onMount(async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      country = data.country_name || "Unknown";
    } catch (err) {
      console.error("Failed to fetch country:", err);
      country = "Unavailable";
    }
  });
</script>

<footer class="text-center text-sm text-gray-500 p-3 bg-gray-100 mt-4 rounded">
  🌍 Your location: {country}
</footer>
