import { useQuery } from "@tanstack/react-query";
import { PromotionalVideoApi } from "../api/modules/promotional_video";

export const usePromotionalVideoQuery = () => {
    return useQuery({
        queryKey: ["promotional-video"],
        queryFn: PromotionalVideoApi.get,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};
