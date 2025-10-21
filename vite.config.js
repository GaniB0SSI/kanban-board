import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        headers: {
            // Dev-only: allow eval for Vite HMR; do NOT use in production
            'Content-Security-Policy': "script-src 'self' 'unsafe-eval'; object-src 'none'; base-uri 'self';"
        }
    }
});
