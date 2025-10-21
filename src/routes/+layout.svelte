<script>
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import UserLocation from "$lib/components/UserLocation.svelte";

    let deferredPrompt = null;
    let showInstall = false;
    let updateAvailable = false;

    // Register SW in production
    if (import.meta.env.PROD && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => {
                console.log('Service Worker registered', reg);

                // Listen for updates
                if (reg.waiting) {
                    // SW is waiting to activate
                    updateAvailable = true;
                }

                reg.addEventListener('updatefound', () => {
                    const newSW = reg.installing;
                    newSW.addEventListener('statechange', () => {
                        if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                            updateAvailable = true;
                        }
                    });
                });
            })
            .catch((err) => console.error('SW registration failed:', err));

        // Listen for messages from SW (optional)
        navigator.serviceWorker.addEventListener('message', (evt) => {
            if (evt.data && evt.data.type === 'SW_UPDATED') {
                updateAvailable = true;
            }
        });
    }

    // Capture beforeinstallprompt to show custom install button
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            showInstall = true;
        });
    }

    function triggerInstall() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            showInstall = false;
        });
    }

    function applyUpdate() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.getRegistration().then(reg => {
            if (!reg) return;
            if (reg.waiting) {
                reg.waiting.postMessage('skipWaiting');
            }
        });
    }
</script>

<svelte:head>
     <link rel="apple-touch-icon" href="/static/icons/apple-icon-180.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#3b82f6" />

	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Page content goes here -->
<slot />

<!-- Footer -->
<UserLocation />

{#if showInstall}
    <div class="fixed bottom-6 left-6">
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md" on:click={triggerInstall}>Install App</button>
    </div>
{/if}

{#if updateAvailable}
    <div class="fixed bottom-6 right-6">
        <button class="bg-amber-600 text-white px-4 py-2 rounded-md" on:click={applyUpdate}>Update Available — Refresh</button>
    </div>
{/if}

