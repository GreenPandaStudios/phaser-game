/**
 * This file provides a react hook for MakeRequest.
 */
import { useState } from "react";
import { makeRequest } from "./makeRequest";

export const useRequest = <TRequest, TResponse>() => {
    const [data, setData] = useState<TResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const request = async (path: string, requestData: TRequest) => {
        setLoading(true);
        try {
            const responseData = await makeRequest<TRequest, TResponse>(path, requestData);
            setData(responseData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, request };
}