export async function verifyScoreSignature(
	score: number,
	signature: string
): Promise<boolean> {
	// Create a signature for the score using the same method as above
	const expectedSignature = await createScoreSignature(
		score,
		new Date().getUTCHours()
	);
	// Compare the expected signature with the provided signature
	if (expectedSignature === signature) {
		return true; // Signatures match
	}

	// Try the last hour as well
	const lastHour = new Date().getUTCHours() - 1;
	const lastHourSignature = await createScoreSignature(score, lastHour);
	if (lastHourSignature === signature) {
		return true; // Signatures match for the last hour
	}
	return false; // Signatures do not match
}

async function createScoreSignature(
	score: number,
	timestamp: number
): Promise<string> {
	// Create a signature for the score using a simple hash function
	// This is a placeholder; in a real application, you might use a more secure method
	const signature = `${score}-apples-${timestamp}`;

	// Return the signature as a SHA-256 hash
	const encoder = new TextEncoder();
	const data = encoder.encode(signature);
	return crypto.subtle.digest("SHA-256", data).then((hashBuffer) => {
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	});
}
