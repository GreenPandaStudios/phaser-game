/**
 * This makes are request to the server.
 * It uses the Fetch API to make a POST request to the server.
 */

export async function makeRequest<TRequest, TResponse>(
	path: string,
	data: TRequest
): Promise<TResponse> {
	const response = await fetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return (await response.json()) as TResponse;
}
