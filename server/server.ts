import express, { Request, Response } from "express";
import path from "path";

const app = express();
const port = process.env.PORT || 3001; // Backend server port

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.get("/api/hello", (req: Request, res: Response) => {
	res.json({ message: "Hello from the Node.js server!" });
});

// --- Production Setup ---
// Serve static files from the Vite build output directory
if (process.env.NODE_ENV === "production") {
	const viteBuildPath = path.resolve(__dirname, "../../dist"); // Adjust if your server's outDir is different or Vite's outDir is different
	app.use(express.static(viteBuildPath));

	// For any other route, serve the index.html from the Vite build
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(viteBuildPath, "index.html"));
	});
}

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
