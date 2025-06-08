import { Request, Response } from "express";
export interface LeaderboardEntry {
	username: string;
	score: number;
}

export const loadLeaderboard = async (req: Request, res: Response) => {
	try {
		const leaderboard = [
			{ username: "August", score: 202 },
			{ username: "Ru", score: 108 },
			{ username: "Ben", score: 13 },
		];
		return res.json(leaderboard); // Return the leaderboard as JSON
	} catch (error) {
		console.error("Error loading leaderboard:", error);
		res.status(500).json({ error: "Failed to load leaderboard" });
	}
};

export const addScore = async (req: Request, res: Response) => {
	const { username } = req.body;

	// Get the score from the cookie
	const scoreCookie = req.cookies.score || "0"; // Default to 0 if not set
	const score = parseInt(scoreCookie, 10) || 0; // Parse the score from the cookie

	if (!username || score === 0) {
		return res.status(400); // Bad Request if username is missing or score is 0
	}

	try {
		// Set the cookie back to zero
		res.cookie("score", "0", { maxAge: 900000, httpOnly: true }); // Reset the score cookie

		return res.json({
			message: `Score for ${username} added successfully!`,
			username,
			score,
		}); // Return a success message with the username and score
	} catch (error) {
		console.error("Error adding score:", error);
		res.status(500);
	}
};
