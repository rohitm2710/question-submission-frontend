import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/api/questions': {
                target: 'https://question-submission-backend-n82oh225q-rohit-s-team6.vercel.app',
                changeOrigin: true,
                rewrite: () => '/v1/questions',
            },
            '/api/auth/login': {
                target: 'https://question-submission-auth-lftb1zeg7-rohit-s-team6.vercel.app',
                changeOrigin: true,
            },
            '/api/auth/change-password': {
                target: 'https://question-submission-auth-lftb1zeg7-rohit-s-team6.vercel.app',
                changeOrigin: true,
                rewrite: () => '/api/change-password',
            },
        },
    },
})