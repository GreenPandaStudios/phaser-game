import { Request, Response } from "express";

export const updateScore = async (_req: Request, res: Response) => {
	// Find the score cookie
	const scoreCookie = _req.cookies.score || "0"; // Default to 0 if not set
	const lastSetCookie = _req.cookies.lastSet || "0"; // Default to 0 if not set

	// Increment the score by 1
	const currentScore = parseInt(scoreCookie, 10) || 0;
	const lastSet = parseInt(lastSetCookie, 10);

	// Check that it was at least 50 milliseconds since the last score was set
	if (Date.now() - lastSet < 50) {
		// Cheating detected, return 429 Too Many Requests
		return res.status(429);
	}
	// Update the last set time
	res.cookie("lastSet", Date.now().toString(), {
		maxAge: 900000,
		httpOnly: true,
	});
	res.cookie("score", currentScore + 1, { maxAge: 900000, httpOnly: true });

	res.status(200);
};
