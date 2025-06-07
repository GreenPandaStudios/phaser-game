import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173, // Vite dev server port
		proxy: {
			// Proxy API requests starting with '/api' to the Node.js server
			"/api": {
				target: "http://localhost:3001", // Backend server URL
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: "server/dist/vite-build", // Output directory for the Vite build
	},
});
