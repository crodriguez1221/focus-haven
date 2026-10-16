import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite configuration for Focus Haven
export default defineConfig({
    plugins: [react()],
    base: '/focus-haven/',
})