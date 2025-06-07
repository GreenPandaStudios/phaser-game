import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const port = process.env.PORT || 3001; // Backend server port
console.log("--- RUNNING LATEST server.ts @ 10:48 AM ---");
// --- ES Module Boilerplate for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -------------------------------------------
// Serve static files from the Vite build directory
const viteBuildPath = path.join(__dirname, "vite-build");

// Middleware to parse JSON bodies
app.use(express.static(viteBuildPath));

// API routes
app.get("/api/hello", (_req: Request, res: Response) => {
	res.json({ message: "Hello from the Node.js server!" });
});

// For any other route, serve the index.html from the Vite build
app.get("*", (_req, res) => {
	res.sendFile(path.resolve(viteBuildPath, "index.html"));
});
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
