export async function createScoreSignature(score: number): Promise<string> {
	// Create a signature for the score using a simple hash function
	// This is a placeholder; in a real application, you might use a more secure method
	const timestamp = new Date().getUTCHours();
	const signature = `${score}-apples-${timestamp}`;

	// Return the signature as a SHA-256 hash
	const encoder = new TextEncoder();
	const data = encoder.encode(signature);
	return crypto.subtle.digest("SHA-256", data).then((hashBuffer) => {
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	});
}
