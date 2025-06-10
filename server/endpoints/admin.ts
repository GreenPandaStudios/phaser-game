import { Request, Response } from "express";
import { LeaderboardEntry } from "./leaderboard.js";
import { verifyPassword } from "../utils/verifyPassword.js";
import { db } from "../firebase/index.js";

/**
 *
 * @param req
 * @param res
 * @returns
 */
const login = async (req: Request, res: Response) => {
	try {
		if (!req.query.password) {
			return res.status(400).json({ error: "Missing password" });
		}
		const password = req.query["password"]?.toString() ?? "";
		if (password === "" || (await verifyPassword(password))) {
			return res.status(401).json({
				error: "Invalid Password",
			});
		}

		// Set the cookie if the pwassword was valid
		res.cookie("password", password);

		return res.json({ message: "Logged In" }); // Return the leaderboard as JSON
	} catch (error) {
		console.error("Error loading leaderboard:", error);
		res.status(500).json({ error: "Failed to load leaderboard" });
	}
};

async function verifyCookie(req: Request): Promise<boolean> {
	if (!req.cookies || !req.cookies["password"]) {
		return false;
	}
	const password = req.cookies["password"] ?? "";

	return await verifyCookie(password);
}

interface ApprovalEntry extends LeaderboardEntry {
	/**
	 * The id of this entry for approval
	 */
	id: string;
}

/**
 *
 * @param req
 * @param res
 * @returns
 */

const loadApprovals = async (req: Request, res: Response) => {
	// Check that the user is authenticated
	if (!(await verifyCookie(req))) {
		return res.status(401);
	}

	try {
		const leaderboardSnapshot = await db
			.collection("highscore")
			.orderBy("score", "desc")
			.where("needsApproval", "==", "true")
			.limit(10)
			.get();

		const leaderboard: ApprovalEntry[] = [];
		leaderboardSnapshot.forEach((doc) => {
			const data = doc.data() as LeaderboardEntry;
			leaderboard.push({
				username: data.username,
				score: data.score,
				needsApproval: true,
				id: doc.id, // Add the document ID to the entry
			});
		});

		return res.json(leaderboard); // Return the leaderboard approvals as JSON
	} catch (error) {
		console.error("Error loading leaderboard:", error);
		res.status(500).json({ error: "Failed to load leaderboard" });
	}
};

/**
 *
 */
const approveEntry = async (req: Request, res: Response) => {
	// Check that the user is authenticated
	if (!(await verifyCookie(req))) {
		return res.status(401);
	}

	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ error: "Invalid" });
	}

	// Update the entry to not need approval anymore
	const f = await db
		.collection("highscore")
		.doc(id)
		.update({ needsApproval: false });

	return res.json({
		approved: id,
	});
};

/**
 *
 */
const rejectEntry = async (req: Request, res: Response) => {
	// Check that the user is authenticated
	if (!(await verifyCookie(req))) {
		return res.status(401);
	}

	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ error: "Invalid" });
	}

	// Delete all entry we selected
	await db.collection("highscore").doc(id).delete();
	return res.json({
		deleted: id,
	});
};

export { login, loadApprovals, approveEntry, rejectEntry };
