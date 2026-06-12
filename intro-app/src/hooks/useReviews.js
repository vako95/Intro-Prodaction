import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewApi } from "../api/modules/review";

export const useReviewsQuery = () => {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: ReviewApi.getAll,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export const useCreateReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ReviewApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["reviews"]);
        },
    });
};

export const useUpdateReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slug, data }) => ReviewApi.update(slug, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["reviews"]);
        },
    });
};

export const useDeleteReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ReviewApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["reviews"]);
        },
    });
};
