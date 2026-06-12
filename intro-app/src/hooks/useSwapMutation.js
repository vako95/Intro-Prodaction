import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SwapAPI } from "../api/modules/swap";

export const useCreateSwap = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => SwapAPI.create(payload),
        onSuccess: () => queryClient.invalidateQueries(["swap"]),
    });
};

export const useUpdateSwap = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => SwapAPI.update(id, payload),
        onSuccess: () => queryClient.invalidateQueries(["swap"]),
    });
};

export const useDeleteSwap = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => SwapAPI.delete(id),
        onSuccess: () => queryClient.invalidateQueries(["swap"]),
    });
};
