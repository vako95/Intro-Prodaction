import { PersonalAPI } from "../api/modules/personal.js";
import { useQuery } from "@tanstack/react-query";

export const usePersonalQuery = () => {
    return useQuery({
        queryKey: ["personal"],
        queryFn: PersonalAPI.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
}

export const usePersonalDetailQuery = (slug) => {
    return useQuery({
        queryKey: ["personal", slug],
        queryFn: () => PersonalAPI.getBySlug(slug),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
}