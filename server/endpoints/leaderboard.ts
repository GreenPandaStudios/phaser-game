import { Request, Response } from "express";
import { verifyScoreSignature } from "../utils/index.js";
import { db } from "../firebase/index.js";
import { get } from "http";
export interface LeaderboardEntry {
	username: string;
	score: number;
	needsApproval: boolean | undefined;
}

export const loadLeaderboard = async (req: Request, res: Response) => {
	try {
		return res.json(await getTop10()); // Return the leaderboard as JSON
	} catch (error) {
		console.error("Error loading leaderboard:", error);
		res.status(500).json({ error: "Failed to load leaderboard" });
	}
};

export const addScore = async (req: Request, res: Response) => {
	const { username, score, signature } = req.body;
	if (
		!req.headers ||
		!req.headers["x-header"] ||
		req.headers["x-header"] !== "MakeRequest"
	) {
		return res.status(403).json({ error: "Unauthorized request" });
	}

	// Decrypt the score using the provided encryption method
	// Base64 decode the score
	// Ensure score is a string before decoding
	const scoreString = typeof score === "string" ? score : String(score);
	try {
		const decodedScore = Buffer.from(scoreString, "base64").toString();
		// Convert the decoded score to a number
		const numericScore = parseInt(decodedScore, 10);

		// Check if the conversion was successful
		if (isNaN(numericScore)) {
			return res.status(400).json({ error: "Invalid score format" });
		}

		// Update the score in the request body with the decoded value
		req.body.score = numericScore;

		// verify the signature
		if (!signature || typeof signature !== "string") {
			return res.status(400).json({ error: "Invalid signature format" });
		}

		const isValid = await verifyScoreSignature(numericScore, signature);

		if (!isValid) {
			return res.status(400).json({ error: "Stop cheating!" });
		}

		try {
			let needsApproval = false;
			// Get the top 10 scores from the database
			const topScoresSnapshot = await getTop10();

			// Check if there are any scores in the top 10 that are less than or equal to the current score
			if (topScoresSnapshot.find(({ score }) => score <= numericScore)) {
				needsApproval = true;
			}

			// Add the score to the database
			await db
				.collection("highscore")
				.add({ username, score: numericScore, needsApproval });

			res.status(200).json({
				message:
					"Score added successfully." + needsApproval
						? "Your in the top 10! Your score needs to be reviewed"
						: "",
			});
		} catch (error) {
			console.error("Error adding score:", error);
			res.status(500).json({ error: "Failed to add score" });
		}
	} catch (error) {
		console.error("Error decoding score:", error);
		return res.status(400).json({ error: "Failed to decode score" });
	}
};

async function getTop10() {
	const beforeNeededApproval = await db
		.collection("highscore")
		.orderBy("score", "desc")
		.limit(10)
		.get();

	const leaderboard: LeaderboardEntry[] = [];
	beforeNeededApproval.forEach((doc) => {
		const d = doc.data() as LeaderboardEntry;
		leaderboard.push({
			username: d.username,
			score: d.score,
			needsApproval: d.needsApproval || false,
		});
	});

	// Return the top 10 entries
	return leaderboard;
}
