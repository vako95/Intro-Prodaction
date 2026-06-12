import { useQuery } from "@tanstack/react-query";
import { ServiceApi } from "../api/modules/service.js";

export const useServiceQuery = () => {
    return useQuery({
        queryKey: ["service"],
        queryFn: ServiceApi.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}

export const useServiceRawQuery = () => {
    return useQuery({
        queryKey: ["service-raw"],
        queryFn: ServiceApi.getRaw,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}
