import { useQuery } from "@tanstack/react-query";
import { SwapAPI } from "../api/modules/swap.js";

export const useSwapQuery = () => {
    return useQuery({
        queryKey: ["swap"],
        queryFn: SwapAPI.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

