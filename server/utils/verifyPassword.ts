const PASS_HASH =
	"b9fd02ba582a6928447d9d1ac5d927f8d6ca9bf635b6a63ab11cd5db63b4988a";

export async function verifyPassword(password: string): Promise<boolean> {
	const encoder = new TextEncoder();

	// Get the password hash and make sure it is equal
	const data = encoder.encode(password);
	return crypto.subtle
		.digest("SHA-256", data)
		.then((hashBuffer) => {
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
		})
		.then((passHash) => passHash === PASS_HASH);
}
