import { useQuery } from "@tanstack/react-query";
import { QuoteApi } from "../api/modules/quote";


export const useQuoteQuery = () => {
    return useQuery({
        queryKey: ["quote"],
        queryFn: QuoteApi.getAll,
        staleTime: Infinity,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};
