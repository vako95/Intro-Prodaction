import { useQuery } from "@tanstack/react-query";
import { AdvantagesBarAPI } from "../api/modules/advantages_bar.js";

export const useAdvantagesBarQuery = () => {
    return useQuery({
        queryKey: ["advantagesBar"],
        queryFn: AdvantagesBarAPI.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}
