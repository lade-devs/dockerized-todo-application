import { useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryResult,
    UseMutationResult,
} from "@tanstack/react-query";
import { ApiRequest } from "@/lib/api";

interface PostParams {
    endpoint: string;
    payload?: any;
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    refreshEndpoint?: string | string[];
    isTenant?: boolean;
}

const useReactQuery = () => {
    const queryClient = useQueryClient();
    const [postRequestLoading, setPostRequestLoading] = useState(false);

    const postQuery: UseMutationResult<any, any, PostParams> = useMutation({
        mutationFn: async ({
            endpoint,
            payload,
            method = "POST",
            isTenant = false,
        }) => {
            return await ApiRequest({ endpoint, method, payload, isTenant });
        },
        onMutate: () => {
            setPostRequestLoading(true);
        },
        onSettled: () => {
            setPostRequestLoading(false);
        },
        onSuccess: (data, variables) => {
            const { refreshEndpoint } = variables;
            const refreshEndpoints = Array.isArray(refreshEndpoint)
                ? refreshEndpoint
                : refreshEndpoint
                    ? [refreshEndpoint]
                    : [];

            refreshEndpoints.forEach((endpoint) => {
                queryClient.invalidateQueries({ queryKey: [endpoint] });
            });
        },
    });

    const postRequest = async (params: PostParams) => {
        try {
            setPostRequestLoading(true);
            const response = await postQuery.mutateAsync(params);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setPostRequestLoading(false);
        }
    };

    const getQueryInstance = async (
        endpoint: string,
        isTenant = false
    ): Promise<any> => {
        return await queryClient.fetchQuery({
            queryKey: [endpoint],
            queryFn: async () => {
                const res = await ApiRequest({ endpoint, method: "GET", isTenant });
                return res;
            },
            staleTime: 1000 * 60 * 5, // cache valid for 5 minutes
        });
    };

    const getQuery = (
        endpoint: string,
        options?: {
            staleTime?: number;
            refetchInterval?: false | number;
            enabled?: boolean;
            isTenant?: boolean;
        }
    ): UseQueryResult<any> => {
        const {
            staleTime = 0,
            refetchInterval = false,
            enabled = true,
            isTenant,
        } = options || {};

        return useQuery({
            queryKey: [endpoint],
            queryFn: async () => {
                const res = await ApiRequest({ endpoint, method: "GET", isTenant });
                return res;
            },
            staleTime,
            refetchInterval,
            enabled,
        });
    };

    return {
        postQuery,
        postRequest,
        postRequestLoading,
        getQuery,
        getQueryInstance,
    };
};

export default useReactQuery;
