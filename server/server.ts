import express, { Request, response, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
	loadLeaderboard,
	addScore,
	updateScore,
	Admin,
} from "./endpoints/index.js";
const app = express();
const port = process.env.PORT || 8080; // Backend server port
// --- ES Module Boilerplate for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -------------------------------------------
// Serve static files from the Vite build directory
const viteBuildPath = path.join(__dirname, "vite-build");

// Middleware to parse JSON bodies
app.use(express.static(viteBuildPath));
// Middleware to parse JSON bodies
app.use(express.json());

// Leaderboard routes
app.post("/api/leaderboard", loadLeaderboard);
app.post("/api/leaderboard/addScore", addScore);
app.post("/api/score/updateScore", updateScore);

// Admin routes
app.get("/admin/login", Admin.login);
app.post("/api/admin/approvals", Admin.loadApprovals);
app.post("/api/admin/approve", Admin.approveEntry);
app.post("/api/admin/reject", Admin.rejectEntry);

// For any other route, serve the index.html from the Vite build
app.get("*", (_req, res) => {
	res.sendFile(path.resolve(viteBuildPath, "index.html"));
});
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
