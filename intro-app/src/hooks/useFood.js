import { useQuery } from "@tanstack/react-query";
import { FoodAPI } from "../api/modules/food.js";


export const useFoodQuery = () => {
    return useQuery({
        queryKey: ["food"],
        queryFn: FoodAPI.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}
