<script>
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import UserLocation from "$lib/components/UserLocation.svelte";

    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch((err) => console.error('SW registration failed:', err));
    }
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Page content goes here -->
<slot />

<!-- Footer -->
<UserLocation />

