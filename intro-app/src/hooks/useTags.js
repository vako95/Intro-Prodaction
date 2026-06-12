import { useQuery } from "@tanstack/react-query";
import { TagsAPI, CategoriesAPI } from "../api/modules/tags";

export const useTagsQuery = () => {
    return useQuery({
        queryKey: ["tags"],
        queryFn: TagsAPI.getAll,
        staleTime: 10 * 60 * 1000, // 10 минут
    });
};

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: CategoriesAPI.getAll,
        staleTime: 10 * 60 * 1000, // 10 минут
    });
};
