import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiRequestProps {
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    payload?: any;
    headers?: Record<string, string>;
    isTenant?: boolean;
    params?: Record<string, any>;
}

export const ApiRequest = async <T = any>({
    endpoint,
    method = "GET",
    payload,
    headers = {},
    params,
}: ApiRequestProps): Promise<T> => {
    const baseURL =
        (import.meta as any).env.VITE_API_URLE || "http://localhost:9000/api/v1";

    const url = `${baseURL}/${endpoint}`;

    const config: AxiosRequestConfig = {
        url,
        method,
        data: payload,
        params,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...headers,
        },
    };

    try {
        const response: AxiosResponse<T> = await axios(config);
        return response.data;
    } catch (error: any) {
        console.error("API Error:", error?.response || error);
        throw (
            error?.response?.data ||
            error?.message ||
            { message: "Unknown network error" }
        );
    }
};
