/**
 * This makes are request to the server.
 * It uses the Fetch API to make a POST request to the server.
 */

export async function makeRequest<TRequest, TResponse>(
	path: string,
	data: TRequest
): Promise<TResponse> {
	const options: RequestInit = {
		method: "POST",
	};

	if (data !== undefined) {
		options.body = JSON.stringify(data);
		options.headers = {
			"Content-Type": "application/json",
		};
	}

	const response = await fetch(path, options);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return (await response.json()) as TResponse;
}
