import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/api/questions': {
                target: 'https://question-submission-backend.onrender.com',
                changeOrigin: true,
                rewrite: () => '/v1/questions',
            },
        },
    },
})